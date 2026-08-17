"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { faqSchema } from "@/lib/validations/faq"
import type { MutationState } from "./projects"
import type { FaqInsert, FaqUpdate } from "@/lib/supabase/types"

function toNullable<T extends Record<string, unknown>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value === "" ? null : value])
  ) as T
}

function parseFaqForm(formData: FormData) {
  return faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    category: formData.get("category"),
    published: formData.get("published") === "on",
    sort_order: formData.get("sort_order") || 0,
  })
}

export async function createFaq(_prevState: MutationState, formData: FormData): Promise<MutationState> {
  const parsed = parseFaqForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("faqs")
    .insert(toNullable(parsed.data) as FaqInsert)
    .select("id")
    .single()

  if (error) {
    console.error("[createFaq]", error.message)
    return { status: "error", message: "Unable to create the FAQ." }
  }

  revalidatePath("/admin/faqs")
  revalidatePath("/", "layout")
  redirect(`/admin/faqs/${data.id}`)
}

export async function updateFaq(
  id: string,
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseFaqForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("faqs")
    .update(toNullable(parsed.data) as FaqUpdate)
    .eq("id", id)

  if (error) {
    console.error("[updateFaq]", error.message)
    return { status: "error", message: "Unable to save changes." }
  }

  revalidatePath("/admin/faqs")
  revalidatePath(`/admin/faqs/${id}`)
  revalidatePath("/", "layout")
  return { status: "success", message: "FAQ saved." }
}

export async function deleteFaq(id: string): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("faqs").delete().eq("id", id)

  if (error) {
    console.error("[deleteFaq]", error.message)
    return { status: "error", message: "Unable to delete the FAQ." }
  }

  revalidatePath("/admin/faqs")
  revalidatePath("/", "layout")
  return { status: "success", message: "FAQ deleted." }
}

export async function setFaqPublished(id: string, published: boolean): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("faqs").update({ published }).eq("id", id)

  if (error) {
    console.error("[setFaqPublished]", error.message)
    return { status: "error", message: "Unable to update publish status." }
  }

  revalidatePath("/admin/faqs")
  revalidatePath("/", "layout")
  return { status: "success", message: published ? "FAQ published." : "FAQ unpublished." }
}
