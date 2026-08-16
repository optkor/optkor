"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"
import { ScrollTrigger } from "@/lib/motion/gsap"

/**
 * Lenis runs its own rAF loop (autoRaf). This just keeps GSAP ScrollTrigger's
 * cached positions in sync with Lenis's smoothed scroll on every tick, so
 * pinning/scrub read the same scroll value the user is actually seeing
 * instead of lagging a frame behind native scroll events. No-ops when Lenis
 * isn't mounted (touch/reduced-motion) — ScrollTrigger just uses native
 * scroll on its own in that case.
 */
export function GsapLenisSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    function onScroll() {
      ScrollTrigger.update()
    }
    lenis.on("scroll", onScroll)
    return () => {
      lenis.off("scroll", onScroll)
    }
  }, [lenis])

  return null
}
