"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { AdminTable, type AdminColumn } from "./AdminTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { deleteTeamMember, setTeamMemberPublished } from "@/lib/mutations/team"
import type { TeamMember } from "@/lib/supabase/types"

export function TeamMembersTable({ members }: { members: TeamMember[] }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<TeamMember | null>(null)

  function togglePublished(item: TeamMember) {
    startTransition(async () => {
      const result = await setTeamMemberPublished(item.id, !item.published)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function confirmAndDelete() {
    if (!confirmDelete) return
    const item = confirmDelete
    startTransition(async () => {
      const result = await deleteTeamMember(item.id)
      toast(result.message, result.status === "error" ? "error" : "success")
      setConfirmDelete(null)
    })
  }

  const columns: AdminColumn<TeamMember>[] = [
    {
      header: "Name",
      render: (m) => (
        <Link href={`/admin/team/${m.id}`} className="font-medium text-paper hover:text-accent">
          {m.name}
        </Link>
      ),
    },
    { header: "Role", render: (m) => <span className="text-muted">{m.role}</span> },
    {
      header: "Status",
      render: (m) => (
        <button disabled={pending} onClick={() => togglePublished(m)} className="disabled:opacity-50">
          <StatusBadge tone={m.published ? "success" : "muted"}>{m.published ? "Published" : "Draft"}</StatusBadge>
        </button>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (m) => (
        <button
          onClick={() => setConfirmDelete(m)}
          className="text-xs uppercase tracking-wider text-danger hover:underline"
        >
          Delete
        </button>
      ),
    },
  ]

  return (
    <>
      <AdminTable columns={columns} rows={members} />
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete team member?">
        <p className="text-sm text-muted">
          This permanently deletes &ldquo;{confirmDelete?.name}&rdquo;. This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm text-muted hover:text-paper">
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
    </>
  )
}
