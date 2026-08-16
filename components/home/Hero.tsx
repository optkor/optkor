"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Eyebrow } from "@/components/ui/Heading"
import { AccentBlob } from "@/components/ui/AccentBlob"
import { RevealWords, Reveal } from "@/components/motion/Reveal"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const shouldReduceMotion = useReducedMotion()
  // Positional parallax is the vestibular-trigger risk `useReducedMotion`
  // exists for; opacity fades are left as-is (low-risk, no movement).
  const markY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "35%"])
  const markOpacity = useTransform(scrollYProgress, [0, 1], [0.06, 0.02])
  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "12%"])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="field-grain relative min-h-[92vh] overflow-hidden border-b border-line pt-40 pb-24 md:pt-52 md:pb-32"
    >
      <AccentBlob className="pointer-events-none absolute -right-8 -top-8 h-56 w-56 text-accent/25 md:h-80 md:w-80" />

      <motion.div
        aria-hidden
        style={{ y: markY, opacity: markOpacity }}
        className="pointer-events-none absolute -bottom-24 -left-24 h-[26rem] w-[26rem] md:h-[34rem] md:w-[34rem]"
      >
        <Image src="/logo-mark.png" alt="" fill sizes="34rem" className="object-contain" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16"
      >
        <Reveal y={12}>
          <Eyebrow>{dict.home.heroEyebrow}</Eyebrow>
        </Reveal>

        <h1 className="font-display mt-8 max-w-5xl text-[length:var(--text-hero)] leading-[0.96] tracking-tight text-paper">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[length:var(--text-micro)] font-medium uppercase tracking-[0.3em] text-muted">
          Scroll
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-line-strong">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  )
}
