"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"

const EASE = [0.16, 1, 0.3, 1] as const

type RevealProps = {
  children: React.ReactNode
  className?: string
  as?: "div" | "span" | "li"
  delay?: number
  y?: number
  once?: boolean
  duration?: number
  role?: React.AriaRole
}

/**
 * Shared whileInView fade-up wrapper — the single source of truth for the
 * "enter as it scrolls into place" motion repeated across every section.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  y = 20,
  once = true,
  duration = 0.7,
  role,
}: RevealProps) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      role={role}
    >
      {children}
    </MotionTag>
  )
}

const wordContainer = (delay: number, stagger: number) => ({
  hidden: {},
  visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
})

const wordItem = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: EASE } },
}

/**
 * Word-by-word mask reveal for headline copy. Each word rises out of a
 * clipped container instead of the whole block fading in at once.
 *
 * Uses a single whileInView trigger on the parent with variants propagated
 * to children (one IntersectionObserver total). A per-word whileInView was
 * tried first and observed to never fire reliably once there were several
 * simultaneous nested observers on mount.
 */
export function RevealWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  once = true,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  once?: boolean
}) {
  const words = text.split(" ")

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={wordContainer(delay, stagger)}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn(
            "inline-block overflow-hidden pb-[0.08em] align-bottom",
            i < words.length - 1 && "me-[0.25em]"
          )}
        >
          <motion.span className={cn("inline-block", wordClassName)} variants={wordItem}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
