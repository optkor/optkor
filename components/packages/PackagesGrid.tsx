"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { PackageCard } from "./PackageCard"
import type { PackageTier } from "@/lib/data/packages"

type TierContent = { name: string; badgeLabel: string; positioning: string }

/**
 * Client-side orchestration for the package "decision experience" — the
 * hovered/focused tier dominates while the others recede, and a soft glow
 * tracks the active card. Kept as one client component (rather than a
 * render-prop passed down from the server page) since functions can't cross
 * the server/client boundary as props.
 */
export function PackagesGrid({
  tiers,
  tierContent,
  exploreLabel,
}: {
  tiers: PackageTier[]
  tierContent: TierContent[]
  exploreLabel: string
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const glowX = useMotionValue(0)
  const glowY = useMotionValue(0)
  const glowWidth = useMotionValue(0)
  const glowHeight = useMotionValue(0)
  const springX = useSpring(glowX, { stiffness: 120, damping: 22 })
  const springY = useSpring(glowY, { stiffness: 120, damping: 22 })
  const springW = useSpring(glowWidth, { stiffness: 120, damping: 22 })
  const springH = useSpring(glowHeight, { stiffness: 120, damping: 22 })

  function setActive(index: number | null, el?: HTMLElement | null) {
    setActiveIndex(index)
    if (shouldReduceMotion || !el || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    glowX.set(rect.left - containerRect.left + rect.width / 2)
    glowY.set(rect.top - containerRect.top + rect.height / 2)
    glowWidth.set(rect.width * 1.4)
    glowHeight.set(rect.height * 1.4)
  }

  return (
    <div ref={containerRef} className="relative">
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-accent/20 blur-3xl"
          style={{
            left: springX,
            top: springY,
            width: springW,
            height: springH,
            x: "-50%",
            y: "-50%",
            opacity: activeIndex === null ? 0 : 1,
          }}
          transition={{ opacity: { duration: 0.4 } }}
        />
      )}
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3" onMouseLeave={() => setActive(null)}>
        {tiers.map((tier, index) => (
          <PackageCard
            key={tier.slug}
            tier={tier}
            delay={Math.min(index * 0.08, 0.3)}
            exploreLabel={exploreLabel}
            dominant={activeIndex === index}
            dimmed={activeIndex !== null && activeIndex !== index}
            onActivate={(el) => setActive(index, el)}
            onDeactivate={() => setActive(null)}
            {...tierContent[index]}
          />
        ))}
      </div>
    </div>
  )
}
