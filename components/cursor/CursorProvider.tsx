"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { CursorContext, type CursorVariant } from "./CursorContext"

// A viewfinder reticle rather than another filled circle — corner brackets
// frame whatever's underneath, like a camera focusing, fitting a visual
// production studio's identity. Size is the frame's footprint; brackets
// stay a fixed length so the frame always reads as an outline, never a
// filled blob.
const SIZES: Record<CursorVariant, number> = {
  default: 22,
  link: 32,
  view: 84,
  explore: 72,
  start: 60,
  scroll: 64,
}
const BRACKET = 9

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

  const size = SIZES[variant]
  const showDot = variant === "default"

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
          <motion.div
            animate={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative flex items-center justify-center"
          >
            {/* Corner brackets — the reticle frame. Logical properties
                (start/end, border-s/border-e) so the frame is identical in
                RTL, not mirrored. */}
            <motion.span
              aria-hidden
              animate={{ opacity: variant === "link" ? 0.7 : 1 }}
              className="absolute top-0 start-0 border-t border-s border-accent"
              style={{ width: BRACKET, height: BRACKET }}
            />
            <motion.span
              aria-hidden
              animate={{ opacity: variant === "link" ? 0.7 : 1 }}
              className="absolute top-0 end-0 border-t border-e border-accent"
              style={{ width: BRACKET, height: BRACKET }}
            />
            <motion.span
              aria-hidden
              animate={{ opacity: variant === "link" ? 0.7 : 1 }}
              className="absolute bottom-0 start-0 border-b border-s border-accent"
              style={{ width: BRACKET, height: BRACKET }}
            />
            <motion.span
              aria-hidden
              animate={{ opacity: variant === "link" ? 0.7 : 1 }}
              className="absolute bottom-0 end-0 border-b border-e border-accent"
              style={{ width: BRACKET, height: BRACKET }}
            />

            <AnimatePresence>
              {showDot && (
                <motion.span
                  key="dot"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                  className="h-1 w-1 rounded-full bg-accent"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {label && (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="font-display absolute whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.25em] text-accent"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </CursorContext.Provider>
  )
}
