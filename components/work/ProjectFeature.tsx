import Link from "next/link"
import { ViewTransition } from "react"
import { SafeImage } from "@/components/ui/Media"
import { Reveal } from "@/components/motion/Reveal"
import type { Project } from "@/lib/supabase/types"

/**
 * Lead treatment for the first project in the list — full-bleed within the
 * container, title overlaid directly on the image, rather than sitting in
 * the same grid rhythm as everything after it.
 */
export function ProjectFeature({ project }: { project: Project }) {
  return (
    <Reveal>
      <Link href={`/work/${project.slug}`} transitionTypes={["nav-forward"]} className="group block">
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-ink-3 md:aspect-[21/9]">
          <ViewTransition name={`project-${project.id}`} share="auto">
            {project.cover_image ? (
              <SafeImage
                src={project.cover_image}
                alt={project.title}
                fill
                priority
                sizes="100vw"
                className="scale-110 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-100"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                <span className="font-display text-4xl">{project.title.charAt(0)}</span>
              </div>
            )}
          </ViewTransition>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-10">
            <p className="text-xs uppercase tracking-wider text-accent">
              {[project.client, project.category].filter(Boolean).join(" · ") || "Featured"}
            </p>
            <h3 className="font-display max-w-3xl text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.02] text-paper transition-colors group-hover:text-accent">
              {project.title}
            </h3>
          </div>

          {project.year && (
            <span className="absolute top-6 end-6 text-xs text-paper-dim md:top-10 md:end-10">
              {project.year}
            </span>
          )}
        </div>
      </Link>
    </Reveal>
  )
}
