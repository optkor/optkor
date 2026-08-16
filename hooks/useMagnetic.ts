"use client"

import { type RefObject, type MouseEvent } from "react"
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion"

/**
 * Magnetic hover pull for buttons/links — the element drifts toward the
 * pointer within its own bounds, spring-released on leave.
 *
 * Takes the target ref rather than creating one, so the ref itself is a
 * plain `useRef()` call in the calling component (what the react-hooks/refs
 * rule expects) instead of being threaded back out of this hook's return
 * value. No-ops under reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(targetRef: RefObject<T | null>, strength = 0.35) {
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  if (shouldReduceMotion) {
    return { style: {}, onMouseMove: undefined, onMouseLeave: undefined }
  }

  function onMouseMove(event: MouseEvent<T>) {
    const el = targetRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return { style: { x: springX, y: springY }, onMouseMove, onMouseLeave }
}
