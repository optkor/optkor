import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectByIdAdmin } from "@/lib/queries/projects"
import { ProjectForm } from "@/components/admin/ProjectForm"
import { CoverUpload, GalleryManager } from "@/components/admin/MediaManager"
import { updateProject } from "@/lib/mutations/projects"

export const metadata = { title: { absolute: "Edit Project — OPTKOR Admin" } }

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: project, error } = await getProjectByIdAdmin(id)

  if (error || !project) {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Projects
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">{project.title}</h1>

      <div className="mt-10 flex flex-col gap-6 border border-line p-6">
        <CoverUpload projectId={project.id} coverImage={project.cover_image} />
        <GalleryManager projectId={project.id} media={project.project_media} />
      </div>

      <div className="mt-10">
        <ProjectForm action={updateProject.bind(null, id)} project={project} submitLabel="Save Changes" />
      </div>
    </div>
  )
}
