"use client"

import { useState, useTransition } from "react"
import { AdminTable, type AdminColumn } from "./AdminTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Modal } from "@/components/ui/Modal"
import { ResetPasswordModal } from "./ResetPasswordModal"
import { useToast } from "@/components/ui/Toast"
import { deleteAdminAccount, toggleAdminStatus } from "@/lib/mutations/admin-users"
import { formatDateTime } from "@/lib/utils/format"
import type { AdminUserRow } from "@/lib/queries/admin-users"

export function UsersTable({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<AdminUserRow | null>(null)
  const [resetTarget, setResetTarget] = useState<AdminUserRow | null>(null)

  function toggleStatus(user: AdminUserRow) {
    startTransition(async () => {
      const result = await toggleAdminStatus(user.id, !user.disabled)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function confirmAndDelete() {
    if (!confirmDelete) return
    const user = confirmDelete
    startTransition(async () => {
      const result = await deleteAdminAccount(user.id)
      toast(result.message, result.status === "error" ? "error" : "success")
      setConfirmDelete(null)
    })
  }

  const columns: AdminColumn<AdminUserRow>[] = [
    {
      header: "Name",
      render: (u) => (
        <span className="font-medium text-paper">
          {u.fullName ?? "—"}
          {u.id === currentUserId && <span className="ml-2 text-xs text-muted">(you)</span>}
        </span>
      ),
    },
    { header: "Email", render: (u) => <span className="text-muted">{u.email}</span> },
    {
      header: "Status",
      render: (u) => <StatusBadge tone={u.disabled ? "muted" : "success"}>{u.disabled ? "Disabled" : "Active"}</StatusBadge>,
    },
    { header: "Created", render: (u) => <span className="text-muted">{formatDateTime(u.createdAt)}</span> },
    {
      header: "Last Login",
      render: (u) => (
        <span className="text-muted">{u.lastSignInAt ? formatDateTime(u.lastSignInAt) : "Never"}</span>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setResetTarget(u)}
            className="text-xs uppercase tracking-wider text-accent hover:underline"
          >
            Reset Password
          </button>
          <button
            disabled={pending || u.id === currentUserId}
            onClick={() => toggleStatus(u)}
            className="text-xs uppercase tracking-wider text-muted hover:text-paper disabled:opacity-30"
          >
            {u.disabled ? "Enable" : "Disable"}
          </button>
          <button
            disabled={pending || u.id === currentUserId}
            onClick={() => setConfirmDelete(u)}
            className="text-xs uppercase tracking-wider text-danger hover:underline disabled:opacity-30"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminTable columns={columns} rows={users} />

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete admin account?">
        <p className="text-sm text-muted">
          This permanently deletes <span className="text-paper">{confirmDelete?.email}</span> and revokes
          their access immediately. This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 text-sm text-muted hover:text-paper"
          >
            Cancel
          </button>
          <button
            onClick={confirmAndDelete}
            disabled={pending}
            className="bg-danger px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </Modal>

      {resetTarget && (
        <ResetPasswordModal
          open={!!resetTarget}
          onClose={() => setResetTarget(null)}
          targetUserId={resetTarget.id}
          targetEmail={resetTarget.email}
        />
      )}
    </>
  )
}
