"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function Process({ dict }: { dict: Dictionary }) {
  const steps = [
    { title: dict.process.understand, body: dict.process.understandBody },
    { title: dict.process.develop, body: dict.process.developBody },
    { title: dict.process.produce, body: dict.process.produceBody },
    { title: dict.process.refine, body: dict.process.refineBody },
    { title: dict.process.deliver, body: dict.process.deliverBody },
  ]

  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.4"],
  })
  const shouldReduceMotion = useReducedMotion()
  const progress = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0, 1])

  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <Reveal>
          <Eyebrow>{dict.home.processEyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h2" size="xl" className="mt-6 max-w-3xl">
            {dict.home.processTitle}
          </Heading>
        </Reveal>

        <div ref={trackRef} className="relative mt-16 md:ps-8">
          <span aria-hidden className="absolute left-0 top-0 hidden h-full w-px bg-line md:block rtl:left-auto rtl:right-0" />
          <motion.span
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute left-0 top-0 hidden h-full w-px origin-top bg-accent md:block rtl:left-auto rtl:right-0"
          />

          <div className="flex flex-col divide-y divide-line">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                delay={Math.min(index * 0.08, 0.4)}
                className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[100px_1fr_2fr] md:items-baseline"
              >
                <span className="font-display text-2xl text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl text-paper">{step.title}</h3>
                <p className="max-w-xl text-sm text-muted">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
