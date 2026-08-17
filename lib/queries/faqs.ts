import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Faq } from "@/lib/supabase/types"
import type { QueryResult } from "./projects"

export async function getPublishedFaqs(): Promise<QueryResult<Faq[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[getPublishedFaqs]", error.message)
    return { data: null, error: "Unable to load FAQs right now." }
  }

  return { data: data ?? [], error: null }
}

// --- Admin ---

export async function getAllFaqsAdmin(): Promise<QueryResult<Faq[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true })

  if (error) {
    console.error("[getAllFaqsAdmin]", error.message)
    return { data: null, error: "Unable to load FAQs." }
  }

  return { data: data ?? [], error: null }
}

export async function getFaqByIdAdmin(id: string): Promise<QueryResult<Faq | null>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("faqs").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("[getFaqByIdAdmin]", error.message)
    return { data: null, error: "Unable to load this FAQ." }
  }

  return { data, error: null }
}
