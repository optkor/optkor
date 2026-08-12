import type { MetadataRoute } from "next"
import { getPublishedProjects } from "@/lib/queries/projects"
import { getPublishedServices } from "@/lib/queries/services"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ]

  const [{ data: projects }, { data: services }] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
  ])

  const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: project.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const serviceRoutes: MetadataRoute.Sitemap = (services ?? []).map((service) => ({
    url: `${siteUrl}/services#${service.slug}`,
    lastModified: service.updated_at,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes]
}
