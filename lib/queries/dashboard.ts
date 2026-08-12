import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { QueryResult } from "./projects"

export type DashboardStats = {
  totalProjects: number
  publishedProjects: number
  draftProjects: number
  featuredProjects: number
  totalServices: number
  publishedServices: number
  newMessages: number
  totalMessages: number
}

export async function getDashboardStats(): Promise<QueryResult<DashboardStats>> {
  const supabase = await createClient()

  const [projectsRes, servicesRes, messagesRes] = await Promise.all([
    supabase.from("projects").select("published, featured"),
    supabase.from("services").select("published"),
    supabase.from("contact_messages").select("status"),
  ])

  if (projectsRes.error || servicesRes.error || messagesRes.error) {
    console.error(
      "[getDashboardStats]",
      projectsRes.error?.message,
      servicesRes.error?.message,
      messagesRes.error?.message
    )
    return { data: null, error: "Unable to load dashboard stats." }
  }

  const projects = projectsRes.data ?? []
  const services = servicesRes.data ?? []
  const messages = messagesRes.data ?? []

  return {
    data: {
      totalProjects: projects.length,
      publishedProjects: projects.filter((p) => p.published).length,
      draftProjects: projects.filter((p) => !p.published).length,
      featuredProjects: projects.filter((p) => p.featured).length,
      totalServices: services.length,
      publishedServices: services.filter((s) => s.published).length,
      newMessages: messages.filter((m) => m.status === "new").length,
      totalMessages: messages.length,
    },
    error: null,
  }
}
