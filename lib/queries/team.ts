import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { TeamMember } from "@/lib/supabase/types"
import type { QueryResult } from "./projects"

export async function getPublishedTeamMembers(): Promise<QueryResult<TeamMember[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[getPublishedTeamMembers]", error.message)
    return { data: null, error: "Unable to load the team right now." }
  }

  return { data: data ?? [], error: null }
}

// --- Admin ---

export async function getAllTeamMembersAdmin(): Promise<QueryResult<TeamMember[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[getAllTeamMembersAdmin]", error.message)
    return { data: null, error: "Unable to load team members." }
  }

  return { data: data ?? [], error: null }
}

export async function getTeamMemberByIdAdmin(id: string): Promise<QueryResult<TeamMember | null>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("[getTeamMemberByIdAdmin]", error.message)
    return { data: null, error: "Unable to load this team member." }
  }

  return { data, error: null }
}
