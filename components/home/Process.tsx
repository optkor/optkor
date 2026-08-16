"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import { useCursor } from "@/components/cursor/CursorContext"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { gsap } from "@/lib/motion/gsap"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function Process({ dict }: { dict: Dictionary }) {
  const steps = [
    { title: dict.process.understand, body: dict.process.understandBody },
    { title: dict.process.develop, body: dict.process.developBody },
    { title: dict.process.produce, body: dict.process.produceBody },
    { title: dict.process.refine, body: dict.process.refineBody },
    { title: dict.process.deliver, body: dict.process.deliverBody },
  ]

  const shouldReduceMotion = useReducedMotion()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const journeyEnabled = isDesktop && !shouldReduceMotion
  const cursor = useCursor()

  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)

  // Desktop: a real horizontal journey — vertical scroll is pinned and
  // converted into horizontal motion across the track, so moving through
  // the five stages is literally what scrolling does here.
  useGSAP(
    () => {
      if (!journeyEnabled || !pinRef.current || !trackRef.current) return
      const track = trackRef.current
      const isRtl = getComputedStyle(document.documentElement).direction === "rtl"
      const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0)

      const tween = gsap.to(track, {
        x: () => (isRtl ? distance() : -distance()),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top+=80",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (lineRef.current) lineRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: pinRef, dependencies: [journeyEnabled, steps.length] }
  )

  // Mobile/tablet fallback: vertical stack with a scroll-linked rail.
  const railRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.8", "end 0.5"],
  })
  const railProgress = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0, 1])

  return (
    <section className="border-t border-line pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-0 lg:pb-24">
      <Container className="lg:pt-32">
        <Reveal>
          <Eyebrow>{dict.home.processEyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h2" size="xl" className="mt-6 max-w-3xl">
            {dict.home.processTitle}
          </Heading>
        </Reveal>
      </Container>

      {/* Desktop pinned horizontal journey */}
      {journeyEnabled ? (
        <div
          ref={pinRef}
          onMouseEnter={() => cursor.setCursor("scroll", dict.common.scroll)}
          onMouseLeave={() => cursor.resetCursor()}
          className="relative mt-16 hidden h-screen overflow-hidden lg:block"
        >
          <div className="absolute inset-x-0 top-0">
            <Container>
              <span aria-hidden className="relative block h-px w-full bg-line">
                <span
                  ref={lineRef}
                  aria-hidden
                  className="absolute inset-y-0 start-0 block h-px w-full origin-left bg-accent rtl:origin-right"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </Container>
          </div>
          <div ref={trackRef} className="flex h-full items-center will-change-transform">
            {steps.map((step, index) => (
              <div key={step.title} className="flex h-full w-[80vw] shrink-0 flex-col justify-center px-8 md:w-[60vw] md:px-16">
                <span aria-hidden className="font-display text-[clamp(5rem,14vw,11rem)] leading-none text-line-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-6 max-w-lg text-3xl text-paper md:text-5xl">{step.title}</h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Mobile/tablet + reduced-motion: vertical stack with a scroll-linked rail */}
      <Container className={journeyEnabled ? "hidden" : undefined}>
        <div ref={railRef} className="relative mt-16 ps-8">
          <span aria-hidden className="absolute left-0 top-0 block h-full w-px bg-line rtl:left-auto rtl:right-0" />
          <motion.span
            aria-hidden
            style={{ scaleY: railProgress }}
            className="absolute left-0 top-0 block h-full w-px origin-top bg-accent rtl:left-auto rtl:right-0"
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
