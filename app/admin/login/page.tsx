import type { Metadata } from "next"
import { LoginForm } from "@/components/admin/LoginForm"

export const metadata: Metadata = {
  title: { absolute: "Admin Login — OPTKOR" },
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-2xl text-paper">
          OPTKOR <span className="text-accent">Admin</span>
        </p>
        <p className="mt-2 text-center text-sm text-muted">Sign in to manage the site.</p>
        <div className="mt-10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
