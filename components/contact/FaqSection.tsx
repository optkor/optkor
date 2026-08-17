"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { Faq } from "@/lib/supabase/types"

const EASE = [0.16, 1, 0.3, 1] as const

export function FaqSection({ dict, faqs }: { dict: Dictionary; faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (faqs.length === 0) return null

  return (
    <section className="border-t border-line py-24">
      <Container>
        <Reveal>
          <Eyebrow>{dict.contact.faqEyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h2" size="lg" className="mt-6 max-w-xl">
            {dict.contact.faqTitle}
          </Heading>
        </Reveal>

        <ul className="mt-12 list-none border-t border-line">
          {faqs.map((faq, index) => {
            const open = openId === faq.id
            return (
              <Reveal key={faq.id} as="li" delay={Math.min(index * 0.05, 0.3)}>
                <div className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : faq.id)}
                    aria-expanded={open}
                    className="group flex w-full items-baseline justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-lg text-paper transition-colors group-hover:text-accent md:text-xl">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "font-display shrink-0 text-xl text-muted transition-transform duration-300",
                        open && "rotate-45 text-accent"
                      )}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 text-sm leading-relaxed text-paper-dim md:text-base">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
