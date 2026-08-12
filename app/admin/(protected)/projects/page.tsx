import Link from "next/link"
import { getAllProjectsAdmin } from "@/lib/queries/projects"
import { ProjectsTable } from "@/components/admin/ProjectsTable"
import { EmptyState, ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "Projects — OPTKOR Admin" } }

export default async function AdminProjectsPage() {
  const { data, error } = await getAllProjectsAdmin()
  const projects = data ?? []

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-ink hover:bg-accent-soft"
        >
          New Project
        </Link>
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState body={error} />
        ) : projects.length === 0 ? (
          <EmptyState title="No projects yet" body="Create your first project to get started." />
        ) : (
          <ProjectsTable projects={projects} />
        )}
      </div>
    </div>
  )
}
