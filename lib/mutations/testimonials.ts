"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { testimonialSchema } from "@/lib/validations/testimonial"
import type { MutationState } from "./projects"
import type { TestimonialInsert, TestimonialUpdate } from "@/lib/supabase/types"

function toNullable<T extends Record<string, unknown>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value === "" ? null : value])
  ) as T
}

function parseTestimonialForm(formData: FormData) {
  return testimonialSchema.safeParse({
    quote: formData.get("quote"),
    client_name: formData.get("client_name"),
    client_title: formData.get("client_title"),
    client_company: formData.get("client_company"),
    avatar_url: formData.get("avatar_url"),
    published: formData.get("published") === "on",
    sort_order: formData.get("sort_order") || 0,
  })
}

export async function createTestimonial(
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseTestimonialForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .insert(toNullable(parsed.data) as TestimonialInsert)
    .select("id")
    .single()

  if (error) {
    console.error("[createTestimonial]", error.message)
    return { status: "error", message: "Unable to create the testimonial." }
  }

  revalidatePath("/admin/testimonials")
  revalidatePath("/", "layout")
  redirect(`/admin/testimonials/${data.id}`)
}

export async function updateTestimonial(
  id: string,
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseTestimonialForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("testimonials")
    .update(toNullable(parsed.data) as TestimonialUpdate)
    .eq("id", id)

  if (error) {
    console.error("[updateTestimonial]", error.message)
    return { status: "error", message: "Unable to save changes." }
  }

  revalidatePath("/admin/testimonials")
  revalidatePath(`/admin/testimonials/${id}`)
  revalidatePath("/", "layout")
  return { status: "success", message: "Testimonial saved." }
}

export async function deleteTestimonial(id: string): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("testimonials").delete().eq("id", id)

  if (error) {
    console.error("[deleteTestimonial]", error.message)
    return { status: "error", message: "Unable to delete the testimonial." }
  }

  revalidatePath("/admin/testimonials")
  revalidatePath("/", "layout")
  return { status: "success", message: "Testimonial deleted." }
}

export async function setTestimonialPublished(id: string, published: boolean): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("testimonials").update({ published }).eq("id", id)

  if (error) {
    console.error("[setTestimonialPublished]", error.message)
    return { status: "error", message: "Unable to update publish status." }
  }

  revalidatePath("/admin/testimonials")
  revalidatePath("/", "layout")
  return { status: "success", message: published ? "Testimonial published." : "Testimonial unpublished." }
}
