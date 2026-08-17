import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Testimonial } from "@/lib/supabase/types"
import type { QueryResult } from "./projects"

export async function getPublishedTestimonials(): Promise<QueryResult<Testimonial[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[getPublishedTestimonials]", error.message)
    return { data: null, error: "Unable to load testimonials right now." }
  }

  return { data: data ?? [], error: null }
}

// --- Admin ---

export async function getAllTestimonialsAdmin(): Promise<QueryResult<Testimonial[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[getAllTestimonialsAdmin]", error.message)
    return { data: null, error: "Unable to load testimonials." }
  }

  return { data: data ?? [], error: null }
}

export async function getTestimonialByIdAdmin(id: string): Promise<QueryResult<Testimonial | null>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("[getTestimonialByIdAdmin]", error.message)
    return { data: null, error: "Unable to load this testimonial." }
  }

  return { data, error: null }
}
