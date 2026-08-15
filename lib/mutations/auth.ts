"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { changeOwnPasswordSchema } from "@/lib/validations/admin-users"
import type { MutationState } from "./projects"

const loginSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().min(1),
})

export type LoginState = { error: string | null }

export async function signIn(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: "Enter a valid email and password." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: "Invalid email or password." }
  }

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) {
    await supabase.auth.signOut()
    return { error: "This account does not have admin access." }
  }

  if (!data.session) {
    return { error: "Sign-in failed. Please try again." }
  }

  redirect("/admin")
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

export async function changeOwnPassword(
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const parsed = changeOwnPasswordSchema.safeParse({
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm_password: formData.get("confirm_password"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return { status: "error", message: "Not authorized." }
  }

  // Re-authenticating with the current password is the only way to verify
  // it without a separate "verify password" API — a wrong current password
  // simply fails this sign-in and never touches the account.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.current_password,
  })

  if (verifyError) {
    return {
      status: "error",
      message: "Current password is incorrect.",
      fieldErrors: { current_password: ["Current password is incorrect."] },
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.new_password,
  })

  if (updateError) {
    console.error("[changeOwnPassword]", updateError.message)
    return { status: "error", message: "Unable to change your password." }
  }

  // Sign out everywhere, including this session, so the old password can
  // no longer be used anywhere and the change takes effect immediately.
  await supabase.auth.signOut({ scope: "global" })
  redirect("/admin/login?notice=password_changed")
}
