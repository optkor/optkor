"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { Reveal } from "@/components/motion/Reveal"
import { useCursor } from "@/components/cursor/CursorContext"
import { useMagnetic } from "@/hooks/useMagnetic"
import type { PackageTier } from "@/lib/data/packages"

export function PackageCard({
  tier,
  name,
  badgeLabel,
  positioning,
  requestLabel,
  delay = 0,
  dominant = false,
  dimmed = false,
  onActivate,
  onDeactivate,
}: {
  tier: PackageTier
  name: string
  badgeLabel: string
  positioning: string
  requestLabel: string
  delay?: number
  dominant?: boolean
  dimmed?: boolean
  onActivate?: (el: HTMLElement) => void
  onDeactivate?: () => void
}) {
  const isPremium = tier.badge === "premium"
  const isCore = tier.badge === "core"
  const cursor = useCursor()
  const ctaRef = useRef<HTMLDivElement>(null)
  const magnetic = useMagnetic(ctaRef, 0.3)

  return (
    <Reveal delay={delay} className="h-full">
      <motion.div
        onMouseEnter={(event) => onActivate?.(event.currentTarget)}
        onFocus={(event) => onActivate?.(event.currentTarget)}
        onMouseLeave={onDeactivate}
        animate={{
          scale: dominant ? 1.03 : dimmed ? 0.97 : 1,
          opacity: dimmed ? 0.55 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex h-full flex-col justify-between border p-8 md:p-10",
          isPremium ? "border-paper bg-paper text-ink" : "border-line",
          isCore && "border-accent lg:-translate-y-4"
        )}
      >
        <div>
          <div className="flex items-center justify-between gap-4">
            <span
              className={cn(
                "font-display text-sm transition-[font-size] duration-300",
                dominant && "text-lg",
                isPremium ? "text-ink/50" : "text-muted"
              )}
            >
              {String(tier.index).padStart(2, "0")}
            </span>
            {badgeLabel && (
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{badgeLabel}</span>
            )}
          </div>
          <h3 className="font-display mt-5 text-2xl md:text-3xl">{name}</h3>
          <p className={cn("mt-4 text-sm leading-relaxed", isPremium ? "text-ink/70" : "text-paper-dim")}>
            {positioning}
          </p>
        </div>

        <div className="mt-10">
          <p
            className={cn(
              "font-display text-4xl transition-[font-size] duration-300",
              dominant && "md:text-5xl"
            )}
          >
            {tier.price}
            <span className={cn("ms-1 text-base font-sans", isPremium ? "text-ink/50" : "text-muted")}>
              {tier.cadence}
            </span>
          </p>
          <motion.div
            ref={ctaRef}
            style={magnetic.style}
            onMouseMove={magnetic.onMouseMove}
            onMouseEnter={() => cursor.setCursor("start")}
            onMouseLeave={() => {
              magnetic.onMouseLeave?.()
              cursor.resetCursor()
            }}
            className="mt-6"
          >
            <Link
              href={`/contact?package=${tier.slug}`}
              className={cn(
                "inline-flex w-full items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors",
                isPremium
                  ? "bg-ink text-paper hover:bg-ink/80"
                  : "border border-line-strong text-paper hover:border-accent hover:text-accent"
              )}
            >
              {requestLabel}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </Reveal>
  )
}
