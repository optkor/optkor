"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function Process({ dict }: { dict: Dictionary }) {
  const steps = [
    { title: dict.process.understand, body: dict.process.understandBody },
    { title: dict.process.develop, body: dict.process.developBody },
    { title: dict.process.produce, body: dict.process.produceBody },
    { title: dict.process.refine, body: dict.process.refineBody },
    { title: dict.process.deliver, body: dict.process.deliverBody },
  ]

  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <Eyebrow>{dict.home.processEyebrow}</Eyebrow>
        <Heading as="h2" size="xl" className="mt-6 max-w-3xl">
          {dict.home.processTitle}
        </Heading>

        <div className="mt-16 flex flex-col divide-y divide-line">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
              className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[100px_1fr_2fr] md:items-baseline"
            >
              <span className="font-display text-2xl text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl text-paper">{step.title}</h3>
              <p className="max-w-xl text-sm text-muted">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
