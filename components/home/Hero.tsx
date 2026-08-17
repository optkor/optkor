"use client"

import { useRef, type MouseEvent } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Eyebrow } from "@/components/ui/Heading"
import { Marquee } from "@/components/ui/Marquee"
import { RevealWords, Reveal } from "@/components/motion/Reveal"
import { useMagnetic } from "@/hooks/useMagnetic"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useThemeColors } from "@/hooks/useThemeColors"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

// WebGL touches nothing on the server and nothing on touch devices — code
// split out entirely so mobile/touch visitors never download three.js.
const HeroScene = dynamic(() => import("./hero/HeroScene").then((m) => m.HeroScene), { ssr: false })

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const hasFinePointer = useMediaQuery("(pointer: fine)")
  const colors = useThemeColors()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const markY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "22%"])
  const markScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "10%"])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scrimOpacity = useTransform(scrollYProgress, [0.25, 1], [0, 1])

  // Desktop pointer-parallax on the brand mark — separate from the WebGL
  // field's own pointer reactivity, this is the DOM layer's depth cue.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 40, damping: 20, mass: 0.5 })
  const springY = useSpring(pointerY, { stiffness: 40, damping: 20, mass: 0.5 })

  function handlePointerMove(event: MouseEvent<HTMLElement>) {
    if (shouldReduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 28)
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 28)
  }
  function handlePointerLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  const primaryRef = useRef<HTMLDivElement>(null)
  const primaryMagnetic = useMagnetic(primaryRef, 0.3)
  const secondaryRef = useRef<HTMLDivElement>(null)
  const secondaryMagnetic = useMagnetic(secondaryRef, 0.3)

  const capabilities = Object.values(dict.capabilities)
  const showScene = hasFinePointer

  return (
    <section
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative flex min-h-screen flex-col overflow-hidden border-b border-line bg-ink"
    >
      {/* Background layer intentionally keeps default pointer-events (not
          `pointer-events-none`) — the WebGL canvas needs real pointer
          events to drive its own reactivity. This doesn't steal clicks
          from the buttons/headline above: they're later in the DOM /
          higher in the stacking order, so they receive hits first;
          the canvas only ever sees pointer movement over empty space. */}
      <div className="absolute inset-0">
        {showScene ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3, ease: EASE }}
            className="absolute inset-0"
          >
            <HeroScene scrollProgress={scrollYProgress} colors={colors} interactive={!shouldReduceMotion} />
          </motion.div>
        ) : (
          <div aria-hidden className="field-grain pointer-events-none absolute inset-0" />
        )}
      </div>

      <motion.div
        aria-hidden
        style={{ y: markY, scale: markScale, x: springX, translateY: springY }}
        className="theme-invert-light pointer-events-none absolute top-1/2 -end-[16%] h-[60vh] w-[60vh] -translate-y-1/2 opacity-[0.1] md:h-[85vh] md:w-[85vh]"
      >
        <Image src="/logo-mark.png" alt="" fill sizes="85vh" className="object-contain" priority />
      </motion.div>

      <div aria-hidden className="hero-scrim pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden
        style={{ opacity: scrimOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent"
      />

      <div className="relative flex flex-1 flex-col justify-center px-6 pt-28 pb-16 md:px-10 md:pt-32 lg:px-16">
        <motion.div style={{ y: contentY, opacity: fade }} className="mx-auto w-full max-w-[1400px]">
          <Reveal y={12}>
            <Eyebrow>{dict.home.heroEyebrow}</Eyebrow>
          </Reveal>

          <h1 className="font-display mt-8 max-w-6xl text-[length:var(--text-hero)] leading-[0.92] tracking-tight text-paper">
            <RevealWords text={dict.home.heroTitle} delay={0.15} />
          </h1>

          <Reveal delay={0.55} className="mt-8 max-w-xl text-base leading-relaxed text-paper-dim md:text-lg">
            <p>{dict.home.heroSubtitle}</p>
          </Reveal>

          <Reveal delay={0.72} className="mt-12 flex flex-wrap gap-4">
            <motion.div
              ref={primaryRef}
              style={primaryMagnetic.style}
              onMouseMove={primaryMagnetic.onMouseMove}
              onMouseLeave={primaryMagnetic.onMouseLeave}
            >
              <Button href="/work" variant="primary">
                {dict.home.heroCtaPrimary}
              </Button>
            </motion.div>
            <motion.div
              ref={secondaryRef}
              style={secondaryMagnetic.style}
              onMouseMove={secondaryMagnetic.onMouseMove}
              onMouseLeave={secondaryMagnetic.onMouseLeave}
            >
              <Button href="/contact" variant="secondary">
                {dict.home.heroCtaSecondary}
              </Button>
            </motion.div>
          </Reveal>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
        className="relative flex items-center gap-8 border-t border-line px-6 py-5 md:px-10 lg:px-16"
      >
        <span className="hidden shrink-0 text-[length:var(--text-micro)] font-medium uppercase tracking-[0.3em] text-muted md:block">
          {dict.home.capabilitiesEyebrow}
        </span>
        <div className="min-w-0 flex-1">
          <Marquee items={capabilities} />
        </div>
      </motion.div>
    </section>
  )
}
