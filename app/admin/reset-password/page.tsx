import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm"

export const metadata: Metadata = {
  title: { absolute: "Reset Password — OPTKOR Admin" },
  robots: { index: false, follow: false },
}

export default async function ResetPasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Reachable only via the code-exchange in /auth/confirm, which is what
  // establishes this session in the first place — no valid session means
  // there's no legitimate way to be here.
  if (!user) {
    redirect("/admin/login?error=reset_link_invalid")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-2xl text-paper">
          OPTKOR <span className="text-accent">Admin</span>
        </p>
        <p className="mt-2 text-center text-sm text-muted">Set a new password for your account.</p>
        <div className="mt-10">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
