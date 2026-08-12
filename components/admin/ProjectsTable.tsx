"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { AdminTable, type AdminColumn } from "./AdminTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { deleteProject, setProjectFeatured, setProjectPublished } from "@/lib/mutations/projects"
import type { Project } from "@/lib/supabase/types"

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null)

  function togglePublished(project: Project) {
    startTransition(async () => {
      const result = await setProjectPublished(project.id, !project.published)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function toggleFeatured(project: Project) {
    startTransition(async () => {
      const result = await setProjectFeatured(project.id, !project.featured)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function confirmAndDelete() {
    if (!confirmDelete) return
    const project = confirmDelete
    startTransition(async () => {
      const result = await deleteProject(project.id)
      toast(result.message, result.status === "error" ? "error" : "success")
      setConfirmDelete(null)
    })
  }

  const columns: AdminColumn<Project>[] = [
    {
      header: "Title",
      render: (p) => (
        <Link href={`/admin/projects/${p.id}`} className="font-medium text-paper hover:text-accent">
          {p.title}
        </Link>
      ),
    },
    { header: "Client", render: (p) => p.client ?? "—" },
    { header: "Category", render: (p) => p.category ?? "—" },
    {
      header: "Status",
      render: (p) => (
        <button disabled={pending} onClick={() => togglePublished(p)} className="disabled:opacity-50">
          <StatusBadge tone={p.published ? "success" : "muted"}>
            {p.published ? "Published" : "Draft"}
          </StatusBadge>
        </button>
      ),
    },
    {
      header: "Featured",
      render: (p) => (
        <button disabled={pending} onClick={() => toggleFeatured(p)} className="disabled:opacity-50">
          <StatusBadge tone={p.featured ? "accent" : "muted"}>{p.featured ? "Featured" : "—"}</StatusBadge>
        </button>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (p) => (
        <button
          onClick={() => setConfirmDelete(p)}
          className="text-xs uppercase tracking-wider text-danger hover:underline"
        >
          Delete
        </button>
      ),
    },
  ]

  return (
    <>
      <AdminTable columns={columns} rows={projects} />
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete project?">
        <p className="text-sm text-muted">
          This permanently deletes &ldquo;{confirmDelete?.title}&rdquo; and its media. This cannot be undone.
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
