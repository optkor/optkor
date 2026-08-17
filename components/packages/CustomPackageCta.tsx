"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion } from "framer-motion"
import { Reveal } from "@/components/motion/Reveal"
import { useMagnetic } from "@/hooks/useMagnetic"

/**
 * Deliberately NOT styled like the three tier cards — a dashed border and
 * looser layout signal "this is a different kind of option," not a fourth
 * package competing with the predefined ones.
 */
export function CustomPackageCta({
  title,
  body,
  cta,
}: {
  title: string
  body: string
  cta: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const magnetic = useMagnetic(ref, 0.3)

  return (
    <Reveal delay={0.3} className="mt-16">
      <div className="flex flex-col items-start gap-6 border border-dashed border-line-strong p-8 sm:flex-row sm:items-center sm:justify-between md:p-10">
        <div>
          <h3 className="font-display text-2xl text-paper">{title}</h3>
          <p className="mt-2 max-w-lg text-sm text-paper-dim">{body}</p>
        </div>
        <motion.div
          ref={ref}
          style={magnetic.style}
          onMouseMove={magnetic.onMouseMove}
          onMouseLeave={magnetic.onMouseLeave}
          className="shrink-0"
        >
          <Link
            href="/contact?custom=1"
            className="inline-flex items-center justify-center border border-line-strong px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:border-accent hover:text-accent"
          >
            {cta}
          </Link>
        </motion.div>
      </div>
    </Reveal>
  )
}
