"use client"

import { useRef } from "react"
import Link from "next/link"
import { ViewTransition } from "react"
import { useReducedMotion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import { SafeImage } from "@/components/ui/Media"
import { Reveal } from "@/components/motion/Reveal"
import { useCursor } from "@/components/cursor/CursorContext"
import { gsap } from "@/lib/motion/gsap"
import type { Project } from "@/lib/supabase/types"

/**
 * Lead treatment for the first project in the list — full-bleed within the
 * container, title overlaid directly on the image, rather than sitting in
 * the same grid rhythm as everything after it. The image and title drift at
 * different rates while the section crosses the viewport, so the composition
 * has real depth rather than moving as one flat layer.
 */
export function ProjectFeature({ project, viewLabel }: { project: Project; viewLabel: string }) {
  const cursor = useCursor()
  const shouldReduceMotion = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (shouldReduceMotion || !frameRef.current) return
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: "none",
            scrollTrigger: { trigger: frameRef.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        )
      }
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 40 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: { trigger: frameRef.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        )
      }
    },
    { scope: frameRef, dependencies: [shouldReduceMotion] }
  )

  return (
    <Reveal>
      <Link
        href={`/work/${project.slug}`}
        transitionTypes={["nav-forward"]}
        onMouseEnter={() => cursor.setCursor("project", viewLabel)}
        onMouseLeave={() => cursor.resetCursor()}
        className="group block"
      >
        <div
          ref={frameRef}
          className="relative aspect-[16/8] w-full overflow-hidden bg-ink-3 md:aspect-[21/9]"
        >
          <div ref={imageRef} className="absolute inset-0">
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
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

          <div ref={titleRef} className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-10">
            <p className="text-xs uppercase tracking-wider text-accent">
              {[project.client, project.category].filter(Boolean).join(" · ") || "Featured"}
            </p>
            <ViewTransition name={`project-title-${project.id}`} share="auto">
              <h3 className="font-display max-w-3xl text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.02] text-paper transition-colors group-hover:text-accent">
                {project.title}
              </h3>
            </ViewTransition>
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
