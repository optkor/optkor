"use client"

import { useRef } from "react"
import { ViewTransition } from "react"
import { useReducedMotion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import { SafeImage } from "@/components/ui/Media"
import { gsap } from "@/lib/motion/gsap"

export function CaseStudyHeroImage({
  src,
  alt,
  transitionName,
}: {
  src: string
  alt: string
  transitionName: string
}) {
  const shouldReduceMotion = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (shouldReduceMotion || !frameRef.current || !imageRef.current) return
      gsap.fromTo(
        imageRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: frameRef.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      )
    },
    { scope: frameRef, dependencies: [shouldReduceMotion] }
  )

  return (
    <div ref={frameRef} className="relative mt-16 aspect-[16/9] w-full overflow-hidden bg-ink-3">
      <div ref={imageRef} className="absolute inset-0">
        <ViewTransition name={transitionName} share="auto">
          <SafeImage src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
        </ViewTransition>
      </div>
    </div>
  )
}
