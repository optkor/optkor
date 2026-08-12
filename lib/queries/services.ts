import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Service } from "@/lib/supabase/types"
import type { QueryResult } from "./projects"

export async function getPublishedServices(): Promise<QueryResult<Service[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[getPublishedServices]", error.message)
    return { data: null, error: "Unable to load services right now." }
  }

  return { data: data ?? [], error: null }
}

export async function getServiceBySlug(slug: string): Promise<QueryResult<Service | null>> {
  if (!slug) return { data: null, error: "Invalid service slug." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle()

  if (error) {
    console.error("[getServiceBySlug]", error.message)
    return { data: null, error: "Unable to load this service right now." }
  }

  return { data, error: null }
}

// --- Admin ---

export async function getAllServicesAdmin(): Promise<QueryResult<Service[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[getAllServicesAdmin]", error.message)
    return { data: null, error: "Unable to load services." }
  }

  return { data: data ?? [], error: null }
}

export async function getServiceByIdAdmin(id: string): Promise<QueryResult<Service | null>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("services").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("[getServiceByIdAdmin]", error.message)
    return { data: null, error: "Unable to load this service." }
  }

  return { data, error: null }
}
