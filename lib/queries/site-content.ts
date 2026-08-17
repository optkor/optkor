import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { SiteContent } from "@/lib/supabase/types"
import type { Locale } from "@/lib/i18n/config"
import type { QueryResult } from "./projects"

export async function getSiteContentOverrides(locale: Locale): Promise<QueryResult<SiteContent[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_content").select("*").eq("locale", locale)

  if (error) {
    console.error("[getSiteContentOverrides]", error.message)
    return { data: null, error: "Unable to load content overrides." }
  }

  return { data: data ?? [], error: null }
}

// --- Admin ---

export async function getAllSiteContentAdmin(): Promise<QueryResult<SiteContent[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_content").select("*")

  if (error) {
    console.error("[getAllSiteContentAdmin]", error.message)
    return { data: null, error: "Unable to load site content." }
  }

  return { data: data ?? [], error: null }
}
