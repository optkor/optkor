"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { AdminTable, type AdminColumn } from "./AdminTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { deleteFaq, setFaqPublished } from "@/lib/mutations/faqs"
import type { Faq } from "@/lib/supabase/types"

export function FaqsTable({ faqs }: { faqs: Faq[] }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<Faq | null>(null)

  function togglePublished(item: Faq) {
    startTransition(async () => {
      const result = await setFaqPublished(item.id, !item.published)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function confirmAndDelete() {
    if (!confirmDelete) return
    const item = confirmDelete
    startTransition(async () => {
      const result = await deleteFaq(item.id)
      toast(result.message, result.status === "error" ? "error" : "success")
      setConfirmDelete(null)
    })
  }

  const columns: AdminColumn<Faq>[] = [
    {
      header: "Question",
      render: (f) => (
        <Link href={`/admin/faqs/${f.id}`} className="font-medium text-paper hover:text-accent">
          {f.question}
        </Link>
      ),
    },
    { header: "Category", render: (f) => <span className="text-muted">{f.category ?? "—"}</span> },
    {
      header: "Status",
      render: (f) => (
        <button disabled={pending} onClick={() => togglePublished(f)} className="disabled:opacity-50">
          <StatusBadge tone={f.published ? "success" : "muted"}>{f.published ? "Published" : "Draft"}</StatusBadge>
        </button>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (f) => (
        <button
          onClick={() => setConfirmDelete(f)}
          className="text-xs uppercase tracking-wider text-danger hover:underline"
        >
          Delete
        </button>
      ),
    },
  ]

  return (
    <>
      <AdminTable columns={columns} rows={faqs} />
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete FAQ?">
        <p className="text-sm text-muted">
          This permanently deletes &ldquo;{confirmDelete?.question}&rdquo;. This cannot be undone.
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
