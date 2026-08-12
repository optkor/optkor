"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { MutationState } from "./projects"

const inviteSchema = z.object({
  email: z.string().trim().min(1).email(),
})

/**
 * Invites a new admin by email via Supabase Auth (service role required),
 * then registers them in admin_users so RLS grants them admin access.
 * Only callable by an already-authenticated admin — the calling page/action
 * must sit behind the /admin route guard.
 */
export async function inviteAdmin(
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = inviteSchema.safeParse({ email: formData.get("email") })
  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email address." }
  }

  // Re-verify the caller is an admin server-side before using elevated privileges.
  const supabase = await createClient()
  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) {
    return { status: "error", message: "Not authorized." }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      status: "error",
      message: "Admin invites require SUPABASE_SERVICE_ROLE_KEY to be configured on the server.",
    }
  }

  const adminClient = createAdminClient()
  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    parsed.data.email
  )

  if (inviteError || !invited.user) {
    console.error("[inviteAdmin] invite", inviteError?.message)
    return { status: "error", message: inviteError?.message ?? "Unable to send the invite." }
  }

  const { error: insertError } = await adminClient
    .from("admin_users")
    .insert({ user_id: invited.user.id })

  if (insertError) {
    console.error("[inviteAdmin] admin_users insert", insertError.message)
    return { status: "error", message: "Invite sent but admin registration failed." }
  }

  revalidatePath("/admin/settings")
  return { status: "success", message: `Invite sent to ${parsed.data.email}.` }
}
