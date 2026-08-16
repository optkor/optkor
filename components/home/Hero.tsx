"use client"

import { useRef } from "react"
import Image from "next/image"
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
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const markY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "22%"])
  const markScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "10%"])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Subtle desktop-only parallax on the background mark, following the
  // pointer. Springs give it weight instead of tracking 1:1 with the mouse.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 40, damping: 20, mass: 0.5 })
  const springY = useSpring(pointerY, { stiffness: 40, damping: 20, mass: 0.5 })

  function handlePointerMove(event: React.MouseEvent<HTMLElement>) {
    if (shouldReduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 28)
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 28)
  }

  function handlePointerLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  const capabilities = Object.values(dict.capabilities)

  return (
    <section
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative flex min-h-screen flex-col overflow-hidden border-b border-line bg-ink"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="field-grain absolute inset-0" />
        <motion.div
          style={{ y: markY, scale: markScale, x: springX, translateY: springY }}
          className="absolute top-1/2 -end-[20%] h-[70vh] w-[70vh] -translate-y-1/2 opacity-[0.07] md:h-[95vh] md:w-[95vh]"
        >
          <Image src="/logo-mark.png" alt="" fill sizes="95vh" className="object-contain" priority />
        </motion.div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-6 pt-28 pb-16 md:px-10 md:pt-32 lg:px-16">
        <motion.div style={{ y: contentY, opacity: fade }} className="mx-auto w-full max-w-[1400px]">
          <Reveal y={12}>
            <Eyebrow>{dict.home.heroEyebrow}</Eyebrow>
          </Reveal>

          <h1 className="font-display mt-8 max-w-6xl text-[length:var(--text-hero)] leading-[0.94] tracking-tight text-paper">
            <RevealWords text={dict.home.heroTitle} delay={0.15} />
          </h1>

          <Reveal delay={0.55} className="mt-8 max-w-xl text-base leading-relaxed text-paper-dim md:text-lg">
            <p>{dict.home.heroSubtitle}</p>
          </Reveal>

          <Reveal delay={0.7} className="mt-12 flex flex-wrap gap-4">
            <Button href="/work" variant="primary">
              {dict.home.heroCtaPrimary}
            </Button>
            <Button href="/contact" variant="secondary">
              {dict.home.heroCtaSecondary}
            </Button>
          </Reveal>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1, ease: EASE }}
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
