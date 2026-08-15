import "server-only"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { QueryResult } from "./projects"

export type AdminUserRow = {
  id: string
  email: string
  fullName: string | null
  createdAt: string
  lastSignInAt: string | null
  disabled: boolean
}

function fullNameFromMetadata(metadata: unknown): string | null {
  if (typeof metadata !== "object" || metadata === null) return null
  const value = (metadata as Record<string, unknown>).full_name
  return typeof value === "string" && value.trim() ? value : null
}

/**
 * admin_users has no SELECT policy for any role (by design — it's only
 * ever read through this SECURITY DEFINER-gated path), so this always
 * goes through the service-role client. The is_admin() check below is
 * the only thing standing between this and exposing every admin's email.
 */
export async function getAdminUsers(): Promise<QueryResult<AdminUserRow[]>> {
  const supabase = await createClient()
  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) {
    return { data: null, error: "Not authorized." }
  }

  const adminClient = createAdminClient()

  const { data: adminRows, error: rowsError } = await adminClient
    .from("admin_users")
    .select("user_id, created_at")
    .order("created_at", { ascending: true })

  if (rowsError || !adminRows) {
    console.error("[getAdminUsers] admin_users", rowsError?.message)
    return { data: null, error: "Unable to load admin users." }
  }

  const { data: usersPage, error: usersError } = await adminClient.auth.admin.listUsers({
    perPage: 200,
  })

  if (usersError) {
    console.error("[getAdminUsers] listUsers", usersError.message)
    return { data: null, error: "Unable to load admin users." }
  }

  const authById = new Map(usersPage.users.map((u) => [u.id, u]))

  const result: AdminUserRow[] = adminRows.map((row) => {
    const authUser = authById.get(row.user_id)
    return {
      id: row.user_id,
      email: authUser?.email ?? "(account not found)",
      fullName: fullNameFromMetadata(authUser?.user_metadata),
      createdAt: authUser?.created_at ?? row.created_at,
      lastSignInAt: authUser?.last_sign_in_at ?? null,
      disabled: Boolean(authUser?.banned_until),
    }
  })

  return { data: result, error: null }
}
