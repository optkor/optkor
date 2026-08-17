"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { SITE_CONTENT_FIELDS } from "@/lib/data/site-content-fields"
import { locales } from "@/lib/i18n/config"
import type { MutationState } from "./projects"

function fieldName(locale: string, section: string, key: string) {
  return `${locale}__${section}__${key}`
}

export async function saveSiteContent(_prevState: MutationState, formData: FormData): Promise<MutationState> {
  const upserts: { section: string; key: string; locale: string; value: string }[] = []
  const deletions: { section: string; key: string; locale: string }[] = []

  for (const locale of locales) {
    for (const { section, key } of SITE_CONTENT_FIELDS) {
      const raw = formData.get(fieldName(locale, section, key))
      const value = typeof raw === "string" ? raw.trim() : ""
      if (value) {
        upserts.push({ section, key, locale, value })
      } else {
        deletions.push({ section, key, locale })
      }
    }
  }

  const supabase = await createClient()

  if (upserts.length > 0) {
    const { error } = await supabase
      .from("site_content")
      .upsert(upserts, { onConflict: "section,key,locale" })

    if (error) {
      console.error("[saveSiteContent:upsert]", error.message)
      return { status: "error", message: "Unable to save content overrides." }
    }
  }

  if (deletions.length > 0) {
    const results = await Promise.all(
      deletions.map(({ section, key, locale }) =>
        supabase.from("site_content").delete().eq("section", section).eq("key", key).eq("locale", locale)
      )
    )
    const failed = results.find((r) => r.error)
    if (failed?.error) {
      console.error("[saveSiteContent:delete]", failed.error.message)
      return { status: "error", message: "Unable to save content overrides." }
    }
  }

  revalidatePath("/", "layout")
  revalidatePath("/admin/content")
  return { status: "success", message: "Content saved." }
}
