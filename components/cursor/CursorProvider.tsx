"use client"

import { useCallback, useEffect, useState } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  useReducedMotion,
} from "framer-motion"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { CursorContext, type CursorVariant } from "./CursorContext"

// An editorial caption, not another circle. Resting state is a small dot
// that stretches along its own direction of travel (a motion-blur cue, not
// a shape). Landing on something meaningful drops the dot for a small
// uppercase caption + underline that draws in beneath the pointer, the way
// a gallery wall label or film credit sits next to what it's naming.
const LABELED: Partial<Record<CursorVariant, true>> = {
  view: true,
  explore: true,
  start: true,
  open: true,
  scroll: true,
}

const DOT_SIZE: Record<CursorVariant, number> = {
  default: 6,
  link: 10,
  view: 6,
  explore: 6,
  start: 6,
  open: 6,
  scroll: 6,
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const hasFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)")
  const active = hasFinePointer && !shouldReduceMotion

  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState<CursorVariant>("default")
  const [label, setLabel] = useState<string | undefined>(undefined)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  // Velocity of the smoothed position drives the resting dot's stretch —
  // same motion values the dot is actually drawn at, so the deformation
  // never disagrees with where the dot appears to be.
  const velocityX = useVelocity(springX)
  const velocityY = useVelocity(springY)
  const speed = useTransform([velocityX, velocityY], (latest) => {
    const [vx, vy] = latest as number[]
    return Math.sqrt(vx * vx + vy * vy)
  })
  const angle = useTransform([velocityX, velocityY], (latest) => {
    const [vx, vy] = latest as number[]
    return (Math.atan2(vy, vx) * 180) / Math.PI
  })
  const stretch = useTransform(speed, [0, 1600], [1, 1.9], { clamp: true })
  const squeeze = useTransform(speed, [0, 1600], [1, 0.6], { clamp: true })
  const dotStretch = useSpring(stretch, { stiffness: 300, damping: 30 })
  const dotSqueeze = useSpring(squeeze, { stiffness: 300, damping: 30 })

  useEffect(() => {
    if (!active) return
    document.documentElement.classList.add("custom-cursor-active")

    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
    }
    const hide = () => setVisible(false)

    window.addEventListener("pointermove", move)
    document.documentElement.addEventListener("mouseleave", hide)
    return () => {
      document.documentElement.classList.remove("custom-cursor-active")
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("mouseleave", hide)
    }
  }, [active, x, y])

  const setCursor = useCallback((v: CursorVariant, l?: string) => {
    setVariant(v)
    setLabel(l)
  }, [])
  const resetCursor = useCallback(() => {
    setVariant("default")
    setLabel(undefined)
  }, [])

  const isLabeled = Boolean(LABELED[variant]) && Boolean(label)
  const showDot = !isLabeled
  const dotSize = DOT_SIZE[variant]
  const isStart = variant === "start"

  return (
    <CursorContext.Provider value={{ setCursor, resetCursor }}>
      {children}
      {active && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[200]"
          style={{ x: springX, y: springY }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <AnimatePresence>
              {showDot && (
                <motion.span
                  key="dot"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{
                    opacity: variant === "link" ? 0.55 : 1,
                    scale: 1,
                    width: dotSize,
                    height: dotSize,
                  }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  style={{ rotate: angle, scaleX: dotStretch, scaleY: dotSqueeze }}
                  className="rounded-full bg-accent"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isLabeled && (
                <motion.div
                  key={`${variant}-${label}`}
                  initial={{ opacity: 0, scale: 0.85, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 4 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute flex flex-col items-center gap-1.5"
                >
                  <span className="font-display flex items-center whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
                    {label}
                    {isStart && (
                      <span aria-hidden className="ms-1.5 inline-block rtl:-scale-x-100">
                        →
                      </span>
                    )}
                  </span>
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-px w-full bg-accent/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </CursorContext.Provider>
  )
}
