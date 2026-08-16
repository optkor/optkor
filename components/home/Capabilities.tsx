"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

const EASE = [0.16, 1, 0.3, 1] as const

export function Capabilities({ dict }: { dict: Dictionary }) {
  const items = Object.values(dict.capabilities)

  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow>{dict.home.capabilitiesEyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <Heading as="h2" size="xl" className="mt-6 max-w-sm">
                {dict.home.capabilitiesTitle}
              </Heading>
            </Reveal>
          </div>

          <ul className="flex list-none flex-col border-t border-line">
            {items.map((item, index) => (
              <li key={item} className="overflow-hidden border-b border-line">
                <motion.div
                  initial={{ clipPath: "inset(0 0 0 100%)" }}
                  whileInView={{ clipPath: "inset(0 0 0 0%)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.3), ease: EASE }}
                  className="group flex items-baseline justify-between gap-6 py-6 transition-colors hover:border-accent/40 md:py-7 rtl:origin-right"
                >
                  <span className="font-display text-2xl text-paper transition duration-300 group-hover:translate-x-2 group-hover:text-accent md:text-3xl rtl:group-hover:-translate-x-2">
                    {item}
                  </span>
                  <span className="font-display text-sm text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
