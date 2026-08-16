"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { Reveal } from "@/components/motion/Reveal"
import type { Service } from "@/lib/supabase/types"

const EASE = [0.16, 1, 0.3, 1] as const

export function ServiceIndex({ services }: { services: Service[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <ul className="list-none border-t border-line">
      {services.map((service, index) => {
        const expandable = Boolean(service.short_description)
        const active = expandable && activeId === service.id

        return (
          <Reveal key={service.id} as="li" delay={Math.min(index * 0.05, 0.3)}>
            <div className="border-b border-line">
              <button
                type="button"
                disabled={!expandable}
                onClick={() => setActiveId(active ? null : service.id)}
                aria-expanded={expandable ? active : undefined}
                className={cn(
                  "group flex w-full items-baseline justify-between gap-6 py-8 text-left transition-colors md:py-10",
                  expandable && "hover:cursor-pointer"
                )}
              >
                <span className="flex items-baseline gap-6">
                  <span className="font-display text-sm text-muted md:text-base">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-display text-2xl text-paper transition-colors md:text-4xl",
                      expandable && "group-hover:text-accent"
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
  )
}
