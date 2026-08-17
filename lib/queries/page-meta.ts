import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { PageMeta } from "@/lib/supabase/types"
import type { QueryResult } from "./projects"

export async function getPageMetaOverride(path: string): Promise<QueryResult<PageMeta | null>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("page_meta").select("*").eq("page_path", path).maybeSingle()

  if (error) {
    console.error("[getPageMetaOverride]", error.message)
    return { data: null, error: "Unable to load page metadata." }
  }

  return { data, error: null }
}

// --- Admin ---

export async function getAllPageMetaAdmin(): Promise<QueryResult<PageMeta[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("page_meta").select("*")

  if (error) {
    console.error("[getAllPageMetaAdmin]", error.message)
    return { data: null, error: "Unable to load page metadata." }
  }

  return { data: data ?? [], error: null }
}
