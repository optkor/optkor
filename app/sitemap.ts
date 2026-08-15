import type { MetadataRoute } from "next"
import { createPublicClient } from "@/lib/supabase/public"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ]

  // Sitemap generation has no incoming request (it can run at build time),
  // so it uses the plain anon-key client rather than the cookie-bound
  // server client — RLS still restricts it to published rows only.
  const supabase = createPublicClient()

  const [{ data: projects, error: projectsError }, { data: services, error: servicesError }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("slug, updated_at")
        .eq("published", true),
      supabase
        .from("services")
        .select("slug, updated_at")
        .eq("published", true),
    ])

  if (projectsError) console.error("[sitemap] projects", projectsError.message)
  if (servicesError) console.error("[sitemap] services", servicesError.message)

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
