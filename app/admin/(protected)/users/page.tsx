import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getAdminUsers } from "@/lib/queries/admin-users"
import { UsersTable } from "@/components/admin/UsersTable"
import { EmptyState, ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "Admin Users — OPTKOR Admin" } }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await getAdminUsers()
  const users = data ?? []

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-paper">Admin Users</h1>
          <p className="mt-2 text-sm text-muted">
            Manage who can sign in to this dashboard — no database access required.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-ink hover:bg-accent-soft"
        >
          New Admin
        </Link>
      </div>

      <div className="mt-8">
        {error || !user ? (
          <ErrorState body={error ?? "Unable to verify your session."} />
        ) : users.length === 0 ? (
          <EmptyState title="No admin users found" />
        ) : (
          <UsersTable users={users} currentUserId={user.id} />
        )}
      </div>
    </div>
  )
}
