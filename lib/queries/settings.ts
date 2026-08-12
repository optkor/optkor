import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { SiteSettings } from "@/lib/supabase/types"

const FALLBACK_SETTINGS: SiteSettings = {
  id: true,
  company_name: "OPTKOR",
  tagline: "From the core, to the vision.",
  contact_email: null,
  contact_phone: null,
  address: null,
  social_links: {},
  seo_title: "OPTKOR — Visual Production Company",
  seo_description:
    "OPTKOR is a B2B visual production partner for marketing agencies and brands.",
  og_image: null,
  homepage_config: {},
  updated_at: new Date(0).toISOString(),
}

// Never fails outward: settings are needed on every page render (layout,
// metadata), so a query error falls back to safe defaults instead of
// forcing every caller to handle an error branch for a non-critical read.
export async function getSiteSettings(): Promise<{ data: SiteSettings; error: null }> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle()

  if (error) {
    console.error("[getSiteSettings]", error.message)
    return { data: FALLBACK_SETTINGS, error: null }
  }

  return { data: data ?? FALLBACK_SETTINGS, error: null }
}
