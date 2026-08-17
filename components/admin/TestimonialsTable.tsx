"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { AdminTable, type AdminColumn } from "./AdminTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { deleteTestimonial, setTestimonialPublished } from "@/lib/mutations/testimonials"
import type { Testimonial } from "@/lib/supabase/types"

export function TestimonialsTable({ testimonials }: { testimonials: Testimonial[] }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null)

  function togglePublished(item: Testimonial) {
    startTransition(async () => {
      const result = await setTestimonialPublished(item.id, !item.published)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function confirmAndDelete() {
    if (!confirmDelete) return
    const item = confirmDelete
    startTransition(async () => {
      const result = await deleteTestimonial(item.id)
      toast(result.message, result.status === "error" ? "error" : "success")
      setConfirmDelete(null)
    })
  }

  const columns: AdminColumn<Testimonial>[] = [
    {
      header: "Client",
      render: (t) => (
        <Link href={`/admin/testimonials/${t.id}`} className="font-medium text-paper hover:text-accent">
          {t.client_name}
        </Link>
      ),
    },
    { header: "Quote", render: (t) => <span className="line-clamp-1 max-w-sm text-muted">{t.quote}</span> },
    {
      header: "Status",
      render: (t) => (
        <button disabled={pending} onClick={() => togglePublished(t)} className="disabled:opacity-50">
          <StatusBadge tone={t.published ? "success" : "muted"}>{t.published ? "Published" : "Draft"}</StatusBadge>
        </button>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (t) => (
        <button
          onClick={() => setConfirmDelete(t)}
          className="text-xs uppercase tracking-wider text-danger hover:underline"
        >
          Delete
        </button>
      ),
    },
  ]

  return (
    <>
      <AdminTable columns={columns} rows={testimonials} />
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete testimonial?">
        <p className="text-sm text-muted">
          This permanently deletes the testimonial from &ldquo;{confirmDelete?.client_name}&rdquo;. This cannot be undone.
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
