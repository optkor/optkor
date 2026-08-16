import type { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm"

export const metadata: Metadata = {
  title: { absolute: "Forgot Password — OPTKOR Admin" },
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-2xl text-paper">
          OPTKOR <span className="text-accent">Admin</span>
        </p>
        <p className="mt-2 text-center text-sm text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <div className="mt-10">
          <ForgotPasswordForm />
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/admin/login" className="hover:text-accent">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
