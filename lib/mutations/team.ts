"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { teamMemberSchema } from "@/lib/validations/team-member"
import type { MutationState } from "./projects"
import type { TeamMemberInsert, TeamMemberUpdate } from "@/lib/supabase/types"

function parseTeamMemberForm(formData: FormData) {
  return teamMemberSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    photo_url: formData.get("photo_url"),
    linkedin_url: formData.get("linkedin_url"),
    instagram_url: formData.get("instagram_url"),
    published: formData.get("published") === "on",
    sort_order: formData.get("sort_order") || 0,
  })
}

function toPayload(data: ReturnType<typeof teamMemberSchema.parse>) {
  const { linkedin_url, instagram_url, name, role, bio, photo_url, published, sort_order } = data
  return {
    name,
    role,
    bio: bio === "" ? null : bio,
    photo_url: photo_url === "" ? null : photo_url,
    published,
    sort_order,
    social_links: {
      linkedin: linkedin_url || null,
      instagram: instagram_url || null,
    },
  }
}

export async function createTeamMember(
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseTeamMemberForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("team_members")
    .insert(toPayload(parsed.data) as TeamMemberInsert)
    .select("id")
    .single()

  if (error) {
    console.error("[createTeamMember]", error.message)
    return { status: "error", message: "Unable to create the team member." }
  }

  revalidatePath("/admin/team")
  revalidatePath("/", "layout")
  redirect(`/admin/team/${data.id}`)
}

export async function updateTeamMember(
  id: string,
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = parseTeamMemberForm(formData)
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("team_members")
    .update(toPayload(parsed.data) as TeamMemberUpdate)
    .eq("id", id)

  if (error) {
    console.error("[updateTeamMember]", error.message)
    return { status: "error", message: "Unable to save changes." }
  }

  revalidatePath("/admin/team")
  revalidatePath(`/admin/team/${id}`)
  revalidatePath("/", "layout")
  return { status: "success", message: "Team member saved." }
}

export async function deleteTeamMember(id: string): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("team_members").delete().eq("id", id)

  if (error) {
    console.error("[deleteTeamMember]", error.message)
    return { status: "error", message: "Unable to delete the team member." }
  }

  revalidatePath("/admin/team")
  revalidatePath("/", "layout")
  return { status: "success", message: "Team member deleted." }
}

export async function setTeamMemberPublished(id: string, published: boolean): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("team_members").update({ published }).eq("id", id)

  if (error) {
    console.error("[setTeamMemberPublished]", error.message)
    return { status: "error", message: "Unable to update publish status." }
  }

  revalidatePath("/admin/team")
  revalidatePath("/", "layout")
  return { status: "success", message: published ? "Team member published." : "Team member unpublished." }
}
