"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { CursorContext, type CursorVariant } from "./CursorContext"

const SIZES: Record<CursorVariant, number> = {
  default: 8,
  link: 44,
  project: 96,
  cta: 56,
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
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="flex items-center justify-center rounded-full bg-accent"
          >
            <AnimatePresence>
              {label && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap px-2 text-center text-[10px] font-medium uppercase tracking-wider text-ink"
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
