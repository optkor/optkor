"use client"

import { ReactLenis } from "lenis/react"
import { useReducedMotion } from "framer-motion"
import { useMediaQuery } from "@/hooks/useMediaQuery"

/**
 * Lenis in `root` mode drives the native document scroll directly (no
 * wrapper divs re-parenting the page), so `position: fixed` elements like
 * the nav keep working normally and keyboard scrolling (Page Down, arrow
 * keys, Home/End) stays native — Lenis only smooths wheel input.
 *
 * Mounted only on fine-pointer (mouse) devices with no reduced-motion
 * preference. Touch devices and reduced-motion get plain native scroll —
 * this component simply doesn't render, rather than trying to configure
 * Lenis into a "disabled" state.
 */
export function SmoothScrollProvider() {
  const shouldReduceMotion = useReducedMotion()
  const isFinePointer = useMediaQuery("(pointer: fine)")

  if (!isFinePointer || shouldReduceMotion) return null

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      }}
    />
  )
}
