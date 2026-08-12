"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { siteSettingsSchema } from "@/lib/validations/settings"
import type { MutationState } from "./projects"

export async function updateSiteSettings(
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = siteSettingsSchema.safeParse({
    company_name: formData.get("company_name"),
    tagline: formData.get("tagline"),
    contact_email: formData.get("contact_email"),
    contact_phone: formData.get("contact_phone"),
    address: formData.get("address"),
    seo_title: formData.get("seo_title"),
    seo_description: formData.get("seo_description"),
    instagram_url: formData.get("instagram_url"),
    linkedin_url: formData.get("linkedin_url"),
    behance_url: formData.get("behance_url"),
  })

  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { instagram_url, linkedin_url, behance_url, ...rest } = parsed.data

  const payload = {
    ...Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v === "" ? null : v])),
    social_links: {
      instagram: instagram_url || null,
      linkedin: linkedin_url || null,
      behance: behance_url || null,
    },
  }

  const supabase = await createClient()
  const { error } = await supabase.from("site_settings").update(payload).eq("id", true)

  if (error) {
    console.error("[updateSiteSettings]", error.message)
    return { status: "error", message: "Unable to save settings." }
  }

  revalidatePath("/", "layout")
  return { status: "success", message: "Settings saved." }
}
