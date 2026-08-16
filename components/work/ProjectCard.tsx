import Link from "next/link"
import { ViewTransition } from "react"
import { SafeImage } from "@/components/ui/Media"
import { Reveal } from "@/components/motion/Reveal"
import type { Project } from "@/lib/supabase/types"

export function ProjectCard({
  project,
  index = 0,
  aspect = "aspect-[4/3]",
}: {
  project: Project
  index?: number
  aspect?: string
}) {
  return (
    <Reveal delay={Math.min(index * 0.06, 0.3)}>
      <Link href={`/work/${project.slug}`} transitionTypes={["nav-forward"]} className="group block">
        <div className={`relative w-full overflow-hidden bg-ink-3 ${aspect}`}>
          <ViewTransition name={`project-${project.id}`} share="auto">
            {project.cover_image ? (
              <SafeImage
                src={project.cover_image}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw"
                className="scale-110 object-cover transition-transform duration-[900ms] ease-out group-hover:scale-100"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                <span className="font-display text-2xl">{project.title.charAt(0)}</span>
              </div>
            )}
          </ViewTransition>
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/5 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <p className="text-xs uppercase tracking-wider text-paper-dim">
              {[project.client, project.category].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl text-paper transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {project.year && <span className="text-xs text-muted">{project.year}</span>}
        </div>
      </Link>
    </Reveal>
  )
}
