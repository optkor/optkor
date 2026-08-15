"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createAdminSchema, resetPasswordSchema } from "@/lib/validations/admin-users"
import type { MutationState } from "./projects"

/** Re-verifies the caller is an admin server-side; every action below is a
 *  thin wrapper around the Supabase service-role client, which bypasses RLS
 *  entirely — this check is the only thing standing between it and anyone
 *  with a valid session. */
async function requireAdmin(): Promise<{ userId: string } | { error: MutationState }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: { status: "error", message: "Not authorized." } }
  }

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) {
    return { error: { status: "error", message: "Not authorized." } }
  }

  return { userId: user.id }
}

async function countActiveAdmins(adminClient: ReturnType<typeof createAdminClient>): Promise<number> {
  const { data: rows } = await adminClient.from("admin_users").select("user_id")
  if (!rows || rows.length === 0) return 0

  const { data: usersPage } = await adminClient.auth.admin.listUsers({ perPage: 200 })
  const authById = new Map((usersPage?.users ?? []).map((u) => [u.id, u]))

  return rows.filter((row) => {
    const authUser = authById.get(row.user_id)
    return authUser && !authUser.banned_until
  }).length
}

export async function createAdminAccount(
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error

  const parsed = createAdminSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      status: "error",
      message: "Admin user management requires SUPABASE_SERVICE_ROLE_KEY to be configured on the server.",
    }
  }

  const adminClient = createAdminClient()
  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name },
  })

  if (createError || !created.user) {
    console.error("[createAdminAccount] createUser", createError?.message)
    const message = createError?.message?.toLowerCase().includes("already")
      ? "An account with this email already exists."
      : "Unable to create the account."
    return { status: "error", message }
  }

  const { error: insertError } = await adminClient
    .from("admin_users")
    .insert({ user_id: created.user.id })

  if (insertError) {
    console.error("[createAdminAccount] admin_users insert", insertError.message)
    // Don't leave an auth user with no admin row and no way to reach it.
    await adminClient.auth.admin.deleteUser(created.user.id)
    return { status: "error", message: "Unable to grant admin access. No account was created." }
  }

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

export async function resetAdminPassword(
  targetUserId: string,
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.updateUserById(targetUserId, {
    password: parsed.data.password,
  })

  if (error) {
    console.error("[resetAdminPassword]", error.message)
    return { status: "error", message: "Unable to reset the password." }
  }

  revalidatePath("/admin/users")
  return { status: "success", message: "Password reset. Share the new password with them securely." }
}

export async function toggleAdminStatus(targetUserId: string, disable: boolean): Promise<MutationState> {
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error

  if (disable && targetUserId === auth.userId) {
    return { status: "error", message: "You cannot disable your own account." }
  }

  const adminClient = createAdminClient()

  if (disable) {
    const activeCount = await countActiveAdmins(adminClient)
    if (activeCount <= 1) {
      return { status: "error", message: "Cannot disable the last active administrator." }
    }
  }

  const { error } = await adminClient.auth.admin.updateUserById(targetUserId, {
    ban_duration: disable ? "876000h" : "none",
  })

  if (error) {
    console.error("[toggleAdminStatus]", error.message)
    return { status: "error", message: "Unable to update account status." }
  }

  revalidatePath("/admin/users")
  return { status: "success", message: disable ? "Account disabled." : "Account re-enabled." }
}

export async function deleteAdminAccount(targetUserId: string): Promise<MutationState> {
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error

  if (targetUserId === auth.userId) {
    return { status: "error", message: "You cannot delete your own account while signed in as it." }
  }

  const adminClient = createAdminClient()

  const activeCount = await countActiveAdmins(adminClient)
  if (activeCount <= 1) {
    return { status: "error", message: "Cannot delete the last active administrator." }
  }

  // admin_users.user_id references auth.users(id) on delete cascade —
  // deleting the auth user removes the admin_users row automatically.
  const { error } = await adminClient.auth.admin.deleteUser(targetUserId)

  if (error) {
    console.error("[deleteAdminAccount]", error.message)
    return { status: "error", message: "Unable to delete the account." }
  }

  revalidatePath("/admin/users")
  return { status: "success", message: "Account deleted." }
}
