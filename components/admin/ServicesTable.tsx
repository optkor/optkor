"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { AdminTable, type AdminColumn } from "./AdminTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { deleteService, setServicePublished } from "@/lib/mutations/services"
import type { Service } from "@/lib/supabase/types"

export function ServicesTable({ services }: { services: Service[] }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null)

  function togglePublished(service: Service) {
    startTransition(async () => {
      const result = await setServicePublished(service.id, !service.published)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function confirmAndDelete() {
    if (!confirmDelete) return
    const service = confirmDelete
    startTransition(async () => {
      const result = await deleteService(service.id)
      toast(result.message, result.status === "error" ? "error" : "success")
      setConfirmDelete(null)
    })
  }

  const columns: AdminColumn<Service>[] = [
    {
      header: "Title",
      render: (s) => (
        <Link href={`/admin/services/${s.id}`} className="font-medium text-paper hover:text-accent">
          {s.title}
        </Link>
      ),
    },
    { header: "Slug", render: (s) => <span className="text-muted">{s.slug}</span> },
    {
      header: "Status",
      render: (s) => (
        <button disabled={pending} onClick={() => togglePublished(s)} className="disabled:opacity-50">
          <StatusBadge tone={s.published ? "success" : "muted"}>
            {s.published ? "Published" : "Draft"}
          </StatusBadge>
        </button>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (s) => (
        <button
          onClick={() => setConfirmDelete(s)}
          className="text-xs uppercase tracking-wider text-danger hover:underline"
        >
          Delete
        </button>
      ),
    },
  ]

  return (
    <>
      <AdminTable columns={columns} rows={services} />
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete service?">
        <p className="text-sm text-muted">
          This permanently deletes &ldquo;{confirmDelete?.title}&rdquo;. This cannot be undone.
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
    </>
  )
}
