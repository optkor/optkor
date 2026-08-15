import Link from "next/link"
import { CreateAdminForm } from "@/components/admin/CreateAdminForm"

export const metadata = { title: { absolute: "New Admin — OPTKOR Admin" } }

export default function NewAdminPage() {
  return (
    <div className="max-w-md">
      <Link href="/admin/users" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Admin Users
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">New Admin</h1>
      <p className="mt-2 text-sm text-muted">
        Creates a real account they can sign in with immediately.
      </p>
      <div className="mt-10">
        <CreateAdminForm />
      </div>
    </div>
  )
}
