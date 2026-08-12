"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function Capabilities({ dict }: { dict: Dictionary }) {
  const items = Object.values(dict.capabilities)

  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <Eyebrow>{dict.home.capabilitiesEyebrow}</Eyebrow>
        <Heading as="h2" size="xl" className="mt-6 max-w-2xl">
          {dict.home.capabilitiesTitle}
        </Heading>

        <div className="mt-16 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              className="border-b border-r border-line px-6 py-10 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
            >
              <span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
              <p className="font-display mt-4 text-lg text-paper">{item}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
