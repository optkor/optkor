"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils/cn"
import { Reveal } from "@/components/motion/Reveal"
import { FrameMark } from "@/components/motion/FrameMark"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { gsap } from "@/lib/motion/gsap"
import type { Service } from "@/lib/supabase/types"

const EASE = [0.16, 1, 0.3, 1] as const

export function ServiceIndex({ services }: { services: Service[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const focused = services[focusIndex]

  const shouldReduceMotion = useReducedMotion()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const pinEnabled = isDesktop && !shouldReduceMotion && services.length > 1
  const stageRef = useRef<HTMLDivElement>(null)
  const scrollLocked = useRef(false)

  // On desktop, scroll position through a pinned stage drives which service
  // dominates the viewport — the list stops being a static index and
  // becomes the thing scrolling actually does.
  useGSAP(
    () => {
      if (!pinEnabled || !stageRef.current) return
      const distance = Math.max(services.length - 1, 1) * 520

      const trigger = gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top+=80",
            end: `+=${distance}`,
            pin: true,
            scrub: 0.4,
            snap: services.length > 1 ? 1 / (services.length - 1) : undefined,
            onUpdate: (self) => {
              if (scrollLocked.current) return
              const next = Math.round(self.progress * (services.length - 1))
              setFocusIndex((prev) => (prev === next ? prev : next))
            },
          },
        }
      )

      return () => {
        trigger.scrollTrigger?.kill()
        trigger.kill()
      }
    },
    { scope: stageRef, dependencies: [pinEnabled, services.length] }
  )

  function handleRowHover(index: number) {
    scrollLocked.current = true
    setFocusIndex(index)
  }
  function handleRowLeave() {
    scrollLocked.current = false
  }

  return (
    <div ref={stageRef} className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_380px] lg:items-center">
      <ul className="list-none border-t border-line">
        {services.map((service, index) => {
          const expandable = Boolean(service.short_description)
          const active = expandable && activeId === service.id
          const isDominant = pinEnabled && index === focusIndex

          return (
            <Reveal key={service.id} as="li" delay={Math.min(index * 0.05, 0.3)}>
              <div
                className="border-b border-line"
                onMouseEnter={() => handleRowHover(index)}
                onMouseLeave={handleRowLeave}
              >
                <button
                  type="button"
                  disabled={!expandable}
                  onClick={() => {
                    setActiveId(active ? null : service.id)
                    setFocusIndex(index)
                  }}
                  aria-expanded={expandable ? active : undefined}
                  className={cn(
                    "group flex w-full items-baseline justify-between gap-6 py-8 text-left transition-[color,transform,opacity] duration-500 md:py-10",
                    expandable && "hover:cursor-pointer",
                    pinEnabled && !isDominant && "opacity-40"
                  )}
                  style={pinEnabled ? { transform: isDominant ? "translateX(0)" : undefined } : undefined}
                >
                  <span className="flex items-baseline gap-6">
                    <span
                      className={cn(
                        "font-display text-sm text-muted transition-colors duration-500 md:text-base",
                        isDominant && "text-accent"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-2xl text-paper transition-[color,transform] duration-500 md:text-4xl",
                        expandable && "group-hover:text-accent",
                        isDominant && "text-accent md:translate-x-3 rtl:md:-translate-x-3 rtl:md:translate-x-0"
                      )}
                    >
                      {service.title}
                    </span>
                  </span>
                  {expandable && (
                    <span
                      aria-hidden
                      className={cn(
                        "font-display shrink-0 text-2xl text-muted transition-transform duration-300",
                        active && "rotate-45 text-accent"
                      )}
                    >
                      +
                    </span>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 text-sm leading-relaxed text-paper-dim md:text-base">
                        {service.short_description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </ul>

      {/* Art-directed companion panel — no service imagery exists, so this
          responds to focus with typography + the brand's own field-grain
          treatment instead of a stock photo. Scroll-pinned on desktop so it
          reads as the stage the list performs against, not a sidebar. */}
      <div className="relative hidden lg:block">
        <div className="sticky top-32 h-[420px] overflow-hidden">
          <FrameMark />
          {/* No `mode="wait"` — a stalled exit (e.g. a slow/backgrounded
              tab) would otherwise block the next panel from ever mounting.
              Concurrent enter/exit crossfades fine for a simple opacity swap. */}
          <AnimatePresence>
            {focused && (
              <motion.div
                key={focused.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="field-grain relative flex h-full flex-col justify-between p-8"
              >
                <span aria-hidden className="font-display text-[8.5rem] leading-none text-line-strong">
                  {String(focusIndex + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-2xl text-paper">{focused.title}</p>
                  <span aria-hidden className="mt-4 block h-px w-16 origin-left bg-accent rtl:origin-right" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
