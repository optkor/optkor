"use client"

import { useRef, type MouseEvent } from "react"
import Link from "next/link"
import { ViewTransition } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import { SafeImage } from "@/components/ui/Media"
import { Reveal } from "@/components/motion/Reveal"
import { useCursor } from "@/components/cursor/CursorContext"
import { gsap } from "@/lib/motion/gsap"
import type { Project } from "@/lib/supabase/types"

export function ProjectCard({
  project,
  index = 0,
  aspect = "aspect-[4/3]",
  viewLabel,
}: {
  project: Project
  index?: number
  aspect?: string
  viewLabel: string
}) {
  const cursor = useCursor()
  const shouldReduceMotion = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // Scroll-linked parallax: the image drifts within its frame as the card
  // crosses the viewport, independent of the hover-triggered scale below.
  useGSAP(
    () => {
      if (shouldReduceMotion || !frameRef.current || !imageRef.current) return
      gsap.fromTo(
        imageRef.current,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )
    },
    { scope: frameRef, dependencies: [shouldReduceMotion] }
  )

  // Pointer-driven tilt on hover — small, GPU-cheap depth cue.
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 18 })
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 18 })

  function handlePointerMove(event: MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 8)
    rotateX.set(py * -8)
  }
  function handlePointerLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <Reveal delay={Math.min(index * 0.06, 0.3)}>
      <Link
        href={`/work/${project.slug}`}
        transitionTypes={["nav-forward"]}
        onMouseEnter={() => cursor.setCursor("view", viewLabel)}
        onMouseLeave={() => cursor.resetCursor()}
        className="group block"
        style={{ perspective: 1200 }}
      >
        <motion.div
          ref={frameRef}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
          className={`relative w-full overflow-hidden bg-ink-3 ${aspect}`}
        >
          <div ref={imageRef} className="absolute inset-0">
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
          </div>
          <span
            aria-hidden
            className="font-display absolute start-4 top-4 text-xs text-paper-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/5 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <p className="text-xs uppercase tracking-wider text-paper-dim">
              {[project.client, project.category].filter(Boolean).join(" · ")}
            </p>
          </div>
        </motion.div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <ViewTransition name={`project-title-${project.id}`} share="auto">
            <h3 className="font-display text-xl text-paper transition-colors group-hover:text-accent">
              {project.title}
            </h3>
          </ViewTransition>
          {project.year && <span className="text-xs text-muted">{project.year}</span>}
        </div>
      </Link>
    </Reveal>
  )
}
