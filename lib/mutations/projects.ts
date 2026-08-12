"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { projectSchema } from "@/lib/validations/project"
import type { ProjectInsert, ProjectUpdate } from "@/lib/supabase/types"

export type MutationState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors?: Record<string, string[] | undefined>
}

function toNullable<T extends Record<string, unknown>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value === "" ? null : value])
  ) as T
}

function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    client: formData.get("client"),
    category: formData.get("category"),
    description: formData.get("description"),
    short_description: formData.get("short_description"),
    year: formData.get("year") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: formData.get("sort_order") || 0,
    cover_image: formData.get("cover_image"),
  })
}

export async function createProject(
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseProjectForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .insert(toNullable(parsed.data) as ProjectInsert)
    .select("id")
    .single()

  if (error) {
    console.error("[createProject]", error.message)
    const message = error.code === "23505" ? "That slug is already in use." : "Unable to create the project."
    return { status: "error", message }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/work")
  redirect(`/admin/projects/${data.id}`)
}

export async function updateProject(
  id: string,
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseProjectForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("projects")
    .update(toNullable(parsed.data) as ProjectUpdate)
    .eq("id", id)

  if (error) {
    console.error("[updateProject]", error.message)
    const message = error.code === "23505" ? "That slug is already in use." : "Unable to save changes."
    return { status: "error", message }
  }

  revalidatePath("/admin/projects")
  revalidatePath(`/admin/projects/${id}`)
  revalidatePath("/work")
  revalidatePath(`/work/${parsed.data.slug}`)
  return { status: "success", message: "Project saved." }
}

export async function deleteProject(id: string): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("[deleteProject]", error.message)
    return { status: "error", message: "Unable to delete the project." }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/work")
  return { status: "success", message: "Project deleted." }
}

export async function setProjectPublished(id: string, published: boolean): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("projects").update({ published }).eq("id", id)

  if (error) {
    console.error("[setProjectPublished]", error.message)
    return { status: "error", message: "Unable to update publish status." }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/work")
  return { status: "success", message: published ? "Project published." : "Project unpublished." }
}

export async function setProjectFeatured(id: string, featured: boolean): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("projects").update({ featured }).eq("id", id)

  if (error) {
    console.error("[setProjectFeatured]", error.message)
    return { status: "error", message: "Unable to update featured status." }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/")
  return { status: "success", message: featured ? "Marked as featured." : "Removed from featured." }
}

export async function reorderProjects(orderedIds: string[]): Promise<MutationState> {
  const supabase = await createClient()
  const updates = orderedIds.map((id, index) =>
    supabase.from("projects").update({ sort_order: index }).eq("id", id)
  )
  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)

  if (failed?.error) {
    console.error("[reorderProjects]", failed.error.message)
    return { status: "error", message: "Unable to save the new order." }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/work")
  return { status: "success", message: "Order saved." }
}
