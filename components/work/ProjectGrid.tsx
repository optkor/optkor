import { ProjectCard } from "./ProjectCard"
import { EmptyState } from "@/components/ui/States"
import type { Project } from "@/lib/supabase/types"

/** Alternating large/small editorial rhythm instead of a uniform grid. */
const RHYTHM = [
  { col: "lg:col-span-4", aspect: "aspect-[16/10]" },
  { col: "lg:col-span-2", aspect: "aspect-[3/4]" },
  { col: "lg:col-span-3", aspect: "aspect-[4/3]" },
  { col: "lg:col-span-3", aspect: "aspect-[4/3]" },
  { col: "lg:col-span-2", aspect: "aspect-[3/4]" },
  { col: "lg:col-span-4", aspect: "aspect-[16/10]" },
]

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
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-6">
      {projects.map((project, index) => {
        const { col, aspect } = RHYTHM[index % RHYTHM.length]
        return (
          <div key={project.id} className={col}>
            <ProjectCard project={project} index={index} aspect={aspect} />
          </div>
        )
      })}
    </div>
  )
}
