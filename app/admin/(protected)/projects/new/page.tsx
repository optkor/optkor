import Link from "next/link"
import { ProjectForm } from "@/components/admin/ProjectForm"
import { createProject } from "@/lib/mutations/projects"

export const metadata = { title: { absolute: "New Project — OPTKOR Admin" } }

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Projects
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">New Project</h1>
      <p className="mt-2 text-sm text-muted">
        Save the project first, then upload cover and gallery media from the edit page.
      </p>
      <div className="mt-10">
        <ProjectForm action={createProject} submitLabel="Create Project" />
      </div>
    </div>
  )
}
