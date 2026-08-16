import { ProjectCard } from "./ProjectCard"
import { ProjectFeature } from "./ProjectFeature"
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
  feature = false,
  viewLabel = "View Project",
}: {
  projects: Project[]
  emptyTitle?: string
  emptyBody?: string
  /** Give the first project a full-bleed lead treatment. */
  feature?: boolean
  /** Cursor label shown on hover (localized — see dict.common.viewProject). */
  viewLabel?: string
}) {
  if (projects.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} />
  }

  const [lead, ...rest] = projects
  const showFeature = feature && Boolean(lead)
  const gridProjects = showFeature ? rest : projects

  return (
    <div className="flex flex-col gap-16">
      {showFeature && <ProjectFeature project={lead} viewLabel={viewLabel} />}

      {gridProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-6">
          {gridProjects.map((project, index) => {
            const { col, aspect } = RHYTHM[index % RHYTHM.length]
            return (
              <div key={project.id} className={col}>
                <ProjectCard project={project} index={index} aspect={aspect} viewLabel={viewLabel} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
