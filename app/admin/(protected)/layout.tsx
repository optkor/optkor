import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export const metadata = { robots: { index: false, follow: false } }

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware already gates /admin, but every protected
  // page re-verifies server-side rather than trusting the client or the
  // middleware pass-through alone.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) {
    redirect("/admin/login?error=not_authorized")
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar email={user.email ?? null} />
      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  )
}
