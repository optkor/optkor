"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils/cn"

const EASE = [0.16, 1, 0.3, 1] as const

const CORNERS = [
  { key: "tl", style: { top: 0, left: 0 }, d: "M0.75 9 V0.75 H9" },
  { key: "tr", style: { top: 0, right: 0 }, d: "M0.75 0.75 H9 V9" },
  { key: "bl", style: { bottom: 0, left: 0 }, d: "M0.75 0.75 V9 H9" },
  { key: "br", style: { bottom: 0, right: 0 }, d: "M9 0.75 V9 H0.75" },
] as const

/**
 * OPTKOR's signature visual device: crop-mark corner brackets, like a
 * viewfinder registering a shot. Used in place of borders/rounded corners on
 * every major image/media/interactive surface (hero, project frames, team
 * photos, quote blocks) — a literal expression of "these people frame and
 * produce visuals" rather than a decorative flourish.
 */
export function FrameMark({ className, delay = 0 }: { className?: string; delay?: number }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 z-10", className)}>
      {CORNERS.map((corner, i) => (
        <motion.svg
          key={corner.key}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className="absolute text-accent"
          style={corner.style}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: delay + i * 0.04, ease: EASE }}
        >
          <path d={corner.d} fill="none" stroke="currentColor" strokeWidth="1.5" />
        </motion.svg>
      ))}
    </div>
  )
}
