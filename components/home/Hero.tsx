"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Eyebrow } from "@/components/ui/Heading"
import { AccentBlob } from "@/components/ui/AccentBlob"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="field-grain relative overflow-hidden border-b border-line py-32 md:py-44">
      <AccentBlob className="pointer-events-none absolute -right-8 -top-8 h-56 w-56 text-accent/25 md:h-80 md:w-80" />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-[26rem] w-[26rem] opacity-[0.06] md:h-[34rem] md:w-[34rem]"
      >
        <Image src="/logo-mark.png" alt="" fill sizes="34rem" className="object-contain" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Eyebrow>{dict.home.heroEyebrow}</Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display mt-8 max-w-4xl text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.98] tracking-tight text-paper"
        >
          {dict.home.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-paper-dim md:text-lg"
        >
          {dict.home.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <Button href="/work" variant="primary">
            {dict.home.heroCtaPrimary}
          </Button>
          <Button href="/contact" variant="secondary">
            {dict.home.heroCtaSecondary}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
