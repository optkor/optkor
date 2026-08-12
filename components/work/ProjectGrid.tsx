import { ProjectCard } from "./ProjectCard"
import { EmptyState } from "@/components/ui/States"
import type { Project } from "@/lib/supabase/types"

export function ProjectGrid({
  projects,
  emptyTitle = "No work yet",
  emptyBody,
}: {
  projects: Project[]
  emptyTitle?: string
  emptyBody?: string
}) {
  if (projects.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} />
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}
