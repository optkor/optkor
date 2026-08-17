"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { PAGE_META_PAGES } from "@/lib/data/page-meta-pages"
import type { MutationState } from "./projects"
import type { PageMetaInsert } from "@/lib/supabase/types"

function fieldName(slug: string, field: string) {
  return `${slug}__${field}`
}

export async function savePageMeta(_prevState: MutationState, formData: FormData): Promise<MutationState> {
  const upserts: PageMetaInsert[] = []
  const clearPaths: string[] = []

  for (const { path, slug } of PAGE_META_PAGES) {
    const seoTitle = String(formData.get(fieldName(slug, "seo_title")) ?? "").trim()
    const seoDescription = String(formData.get(fieldName(slug, "seo_description")) ?? "").trim()
    const ogImage = String(formData.get(fieldName(slug, "og_image")) ?? "").trim()

    if (seoTitle || seoDescription || ogImage) {
      upserts.push({
        page_path: path,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        og_image: ogImage || null,
      })
    } else {
      clearPaths.push(path)
    }
  }

  const supabase = await createClient()

  if (upserts.length > 0) {
    const { error } = await supabase.from("page_meta").upsert(upserts, { onConflict: "page_path" })
    if (error) {
      console.error("[savePageMeta:upsert]", error.message)
      return { status: "error", message: "Unable to save page metadata." }
    }
  }

  if (clearPaths.length > 0) {
    const { error } = await supabase.from("page_meta").delete().in("page_path", clearPaths)
    if (error) {
      console.error("[savePageMeta:delete]", error.message)
      return { status: "error", message: "Unable to save page metadata." }
    }
  }

  for (const { path } of PAGE_META_PAGES) {
    revalidatePath(path)
  }
  revalidatePath("/admin/seo")

  return { status: "success", message: "SEO metadata saved." }
}
