"use client"

import { useRef } from "react"
import { useReducedMotion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { AccentBlob } from "@/components/ui/AccentBlob"
import { Reveal } from "@/components/motion/Reveal"
import { gsap } from "@/lib/motion/gsap"

/**
 * Purpose-built "nothing published yet" composition — same visual weight as
 * the CTA sections, so an empty Work/Services list still reads as an
 * intentional design decision rather than a broken query. The ghost mark
 * drifts on scroll so the section still carries motion even with no imagery.
 */
export function EmptyStateHero({
  eyebrow,
  title,
  body,
  className,
}: {
  eyebrow: string
  title: string
  body?: string
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (shouldReduceMotion || !sectionRef.current || !markRef.current) return
      gsap.fromTo(
        markRef.current,
        { yPercent: -12, rotate: -4 },
        {
          yPercent: 12,
          rotate: 4,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      )
    },
    { scope: sectionRef, dependencies: [shouldReduceMotion] }
  )

  return (
    <div ref={sectionRef} className={cn("field-grain relative overflow-hidden py-24 md:py-32", className)}>
      <AccentBlob className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 text-accent/15 md:h-64 md:w-64" />
      <span
        ref={markRef}
        aria-hidden
        className="font-display pointer-events-none absolute -end-[6%] top-1/2 -translate-y-1/2 select-none text-[clamp(6rem,22vw,16rem)] leading-none text-line-strong/60"
      >
        —
      </span>
      <Container className="relative flex flex-col items-start gap-6">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h2" size="xl" className="max-w-2xl">
            {title}
          </Heading>
        </Reveal>
        {body && (
          <Reveal delay={0.2} className="max-w-lg text-base text-paper-dim">
            <p>{body}</p>
          </Reveal>
        )}
      </Container>
    </div>
  )
}
