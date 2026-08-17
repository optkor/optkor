"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "framer-motion"
import { gsap, ScrollTrigger } from "@/lib/motion/gsap"

/**
 * The signature transition between major sections sitewide: each section
 * rises into place — a rounded mask unfurling to full-bleed — scrubbed
 * directly to scroll position via GSAP ScrollTrigger. This is what makes
 * moving from one section to the next read as a designed beat instead of a
 * plain scroll-into-view fade. Renders a plain div — wrap it in a semantic
 * <section> at the call site.
 *
 * Deliberately clip-path only, no transform/scale: per the CSS spec, any
 * ancestor with a `transform` (or `will-change: transform`) becomes the
 * containing block for descendant `position: fixed` elements. A GSAP
 * ScrollTrigger `pin: true` inside a curtained section (Process, Services)
 * relies on `position: fixed` resolving against the *viewport* — with a
 * transform on this wrapper, the pinned content was instead fixed relative
 * to this scrolling div, drifting off-screen for the whole pinned scroll
 * range. clip-path does not create a containing block, so it doesn't have
 * this failure mode.
 */
export function SectionCurtain({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (shouldReduceMotion || !ref.current) return
      const el = ref.current

      gsap.set(el, { clipPath: "inset(6% round 28px)" })
      gsap.to(el, {
        clipPath: "inset(0% round 0px)",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 40%",
          scrub: 0.6,
        },
      })
    },
    { scope: ref, dependencies: [shouldReduceMotion] }
  )

  return (
    <div ref={ref} className={className} style={{ willChange: "clip-path" }}>
      {children}
    </div>
  )
}

/** Call after dynamic content (images, fonts, late-mounted sections) may have shifted layout. */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}
