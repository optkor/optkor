import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Project, ProjectWithMedia } from "@/lib/supabase/types"

export type QueryResult<T> = { data: T; error: null } | { data: null; error: string }

export async function getPublishedProjects(options?: {
  category?: string
  featuredOnly?: boolean
}): Promise<QueryResult<Project[]>> {
  const supabase = await createClient()

  let query = supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (options?.category) {
    query = query.eq("category", options.category)
  }
  if (options?.featuredOnly) {
    query = query.eq("featured", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("[getPublishedProjects]", error.message)
    return { data: null, error: "Unable to load projects right now." }
  }

  return { data: data ?? [], error: null }
}

export async function getProjectCategories(): Promise<QueryResult<string[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("category")
    .eq("published", true)
    .not("category", "is", null)

  if (error) {
    console.error("[getProjectCategories]", error.message)
    return { data: null, error: "Unable to load categories right now." }
  }

  const categories = Array.from(
    new Set((data ?? []).map((row) => row.category).filter((c): c is string => Boolean(c)))
  ).sort()

  return { data: categories, error: null }
}

export async function getProjectBySlug(slug: string): Promise<QueryResult<ProjectWithMedia | null>> {
  if (!slug || typeof slug !== "string") {
    return { data: null, error: "Invalid project slug." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_media(*)")
    .eq("slug", slug)
    .eq("published", true)
    .order("sort_order", { referencedTable: "project_media", ascending: true })
    .maybeSingle()

  if (error) {
    console.error("[getProjectBySlug]", error.message)
    return { data: null, error: "Unable to load this project right now." }
  }

  return { data: data as ProjectWithMedia | null, error: null }
}

export async function getRelatedProjects(
  currentSlug: string,
  category: string | null,
  limit = 3
): Promise<QueryResult<Project[]>> {
  const supabase = await createClient()
  let query = supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .neq("slug", currentSlug)
    .limit(limit)

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("[getRelatedProjects]", error.message)
    return { data: null, error: "Unable to load related work." }
  }

  return { data: data ?? [], error: null }
}

// --- Admin (RLS-gated: only rows the signed-in admin is authorized to see) ---

export async function getAllProjectsAdmin(): Promise<QueryResult<Project[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[getAllProjectsAdmin]", error.message)
    return { data: null, error: "Unable to load projects." }
  }

  return { data: data ?? [], error: null }
}

export async function getProjectByIdAdmin(id: string): Promise<QueryResult<ProjectWithMedia | null>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_media(*)")
    .eq("id", id)
    .order("sort_order", { referencedTable: "project_media", ascending: true })
    .maybeSingle()

  if (error) {
    console.error("[getProjectByIdAdmin]", error.message)
    return { data: null, error: "Unable to load this project." }
  }

  return { data: data as ProjectWithMedia | null, error: null }
}
