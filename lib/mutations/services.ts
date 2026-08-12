"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { serviceSchema } from "@/lib/validations/service"
import type { MutationState } from "./projects"
import type { ServiceInsert, ServiceUpdate } from "@/lib/supabase/types"

function toNullable<T extends Record<string, unknown>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value === "" ? null : value])
  ) as T
}

function parseServiceForm(formData: FormData) {
  return serviceSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    short_description: formData.get("short_description"),
    icon: formData.get("icon"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: formData.get("sort_order") || 0,
  })
}

export async function createService(
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseServiceForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .insert(toNullable(parsed.data) as ServiceInsert)
    .select("id")
    .single()

  if (error) {
    console.error("[createService]", error.message)
    const message = error.code === "23505" ? "That slug is already in use." : "Unable to create the service."
    return { status: "error", message }
  }

  revalidatePath("/admin/services")
  revalidatePath("/services")
  redirect(`/admin/services/${data.id}`)
}

export async function updateService(
  id: string,
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseServiceForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("services")
    .update(toNullable(parsed.data) as ServiceUpdate)
    .eq("id", id)

  if (error) {
    console.error("[updateService]", error.message)
    const message = error.code === "23505" ? "That slug is already in use." : "Unable to save changes."
    return { status: "error", message }
  }

  revalidatePath("/admin/services")
  revalidatePath(`/admin/services/${id}`)
  revalidatePath("/services")
  return { status: "success", message: "Service saved." }
}

export async function deleteService(id: string): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("services").delete().eq("id", id)

  if (error) {
    console.error("[deleteService]", error.message)
    return { status: "error", message: "Unable to delete the service." }
  }

  revalidatePath("/admin/services")
  revalidatePath("/services")
  return { status: "success", message: "Service deleted." }
}

export async function setServicePublished(id: string, published: boolean): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("services").update({ published }).eq("id", id)

  if (error) {
    console.error("[setServicePublished]", error.message)
    return { status: "error", message: "Unable to update publish status." }
  }

  revalidatePath("/admin/services")
  revalidatePath("/services")
  return { status: "success", message: published ? "Service published." : "Service unpublished." }
}
