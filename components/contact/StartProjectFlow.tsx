"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import { SectionCurtain } from "@/components/motion/SectionCurtain"
import { ContactForm } from "@/components/contact/ContactForm"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { PackageTier } from "@/lib/data/packages"

type Mode = "package" | "custom" | "general"
type Stage = "choose" | "pick-package" | "form"

const EASE = [0.16, 1, 0.3, 1] as const
const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.4, ease: EASE },
}

/**
 * Three distinct inquiries share one page: a custom-scope "Normal Project"
 * brief, a fixed-price "Package" request, and a separate "Custom Package"
 * ask. A direct link (from the package detail page, or the "Need something
 * custom?" card) already knows which one it wants and skips straight to the
 * form; landing here with no scope in mind (Navbar/Hero/CTA "Start a
 * Project" links) surfaces the Normal Project vs Package choice first, so
 * a package inquiry never has to pass back through Project Type/Budget
 * fields that don't apply to it.
 */
export function StartProjectFlow({
  dict,
  packages,
  tierNames,
  initialMode,
  initialPackageSlug,
  whatsappHref,
  contactEmail,
  contactPhone,
}: {
  dict: Dictionary
  packages: PackageTier[]
  tierNames: string[]
  initialMode: "package" | "custom" | null
  initialPackageSlug: string | null
  whatsappHref: string | null
  contactEmail: string | null
  contactPhone: string | null
}) {
  const [stage, setStage] = useState<Stage>(initialMode ? "form" : "choose")
  const [mode, setMode] = useState<Mode>(initialMode ?? "general")
  const [packageSlug, setPackageSlug] = useState<string | null>(initialPackageSlug)

  const packageIndex = packageSlug ? packages.findIndex((tier) => tier.slug === packageSlug) : -1
  const packageName = packageIndex >= 0 ? tierNames[packageIndex] : null
  const packagePrice = packageIndex >= 0 ? `${packages[packageIndex].price}${packages[packageIndex].cadence}` : null

  const cameFromChooser = initialMode === null

  const pageTitle =
    stage === "choose"
      ? dict.contact.title
      : stage === "pick-package"
        ? dict.contact.choosePackageTitle
        : mode === "package"
          ? packageName
          : mode === "custom"
            ? dict.packages.customTitle
            : dict.contact.title
  const pageSubtitle =
    stage === "choose"
      ? dict.contact.subtitle
      : stage === "pick-package"
        ? dict.contact.choosePackageSubtitle
        : mode === "package"
          ? dict.contact.subtitle
          : mode === "custom"
            ? dict.packages.customBody
            : dict.contact.subtitle
  const eyebrow =
    stage === "form" && mode === "package"
      ? dict.packages.requestingLabel
      : stage === "form" && mode === "custom"
        ? dict.packages.customRequesting
        : dict.contact.eyebrow

  return (
    <>
      <div className="pt-24 pb-16 md:pt-32 md:pb-20">
        {cameFromChooser && stage !== "choose" && (
          <Reveal>
            <button
              type="button"
              onClick={() => {
                if (stage === "form" && mode === "package") setStage("pick-package")
                else setStage("choose")
              }}
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
            >
              ← {dict.common.back}
            </button>
          </Reveal>
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={`${stage}-${mode}-${packageSlug}`} {...fade}>
            <Reveal delay={cameFromChooser && stage !== "choose" ? 0.06 : 0}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <Heading as="h1" size={stage === "form" ? "display" : "xl"} className="mt-6 max-w-3xl">
                {pageTitle}
              </Heading>
            </Reveal>
            <Reveal delay={0.18} className="mt-6 max-w-md text-base text-paper-dim md:text-lg">
              <p>{pageSubtitle}</p>
            </Reveal>
          </motion.div>
        </AnimatePresence>
      </div>

      <SectionCurtain className="border-t border-line pt-16 pb-24 md:pb-32">
        <AnimatePresence mode="popLayout" initial={false}>
          {stage === "choose" && (
            <motion.div key="choose" {...fade} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <ChoiceCard
                index="01"
                title={dict.contact.normalProjectTitle}
                body={dict.contact.normalProjectBody}
                onSelect={() => {
                  setMode("general")
                  setStage("form")
                }}
              />
              <ChoiceCard
                index="02"
                title={dict.contact.packageOptionTitle}
                body={dict.contact.packageOptionBody}
                onSelect={() => setStage("pick-package")}
              />
            </motion.div>
          )}

          {stage === "pick-package" && (
            <motion.div key="pick-package" {...fade} className="flex flex-col gap-3">
              {packages.map((tier, index) => (
                <button
                  key={tier.slug}
                  type="button"
                  onClick={() => {
                    setPackageSlug(tier.slug)
                    setMode("package")
                    setStage("form")
                  }}
                  className="group flex items-center justify-between gap-6 border border-line px-6 py-6 text-start transition-colors hover:border-accent md:px-8"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-display text-sm text-muted">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-display text-xl text-paper transition-colors group-hover:text-accent md:text-2xl">
                      {tierNames[index]}
                    </span>
                  </span>
                  <span className="font-display shrink-0 text-lg text-paper-dim">
                    {tier.price}
                    <span className="text-xs font-sans text-muted">{tier.cadence}</span>
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {stage === "form" && (
            <motion.div key="form" {...fade}>
              <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
                <div>
                  {contactEmail && (
                    <Reveal className="text-sm text-muted">
                      <p>
                        {dict.contact.directEmail}{" "}
                        <a href={`mailto:${contactEmail}`} className="text-accent hover:underline">
                          {contactEmail}
                        </a>
                      </p>
                    </Reveal>
                  )}
                  {contactPhone && (
                    <Reveal delay={0.08} className="mt-4 text-sm text-muted">
                      <p>
                        <a href={`tel:${contactPhone}`} className="text-accent hover:underline">
                          {contactPhone}
                        </a>
                      </p>
                    </Reveal>
                  )}
                  {whatsappHref && (
                    <Reveal delay={0.14} className="mt-4 text-sm text-muted">
                      <p>
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                          {dict.packages.whatsapp}
                        </a>
                      </p>
                    </Reveal>
                  )}
                </div>

                <ContactForm
                  dict={dict}
                  mode={mode}
                  packageName={packageName}
                  packagePrice={packagePrice}
                  requestingLabel={mode === "custom" ? dict.packages.customRequesting : dict.packages.requestingLabel}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCurtain>
    </>
  )
}

function ChoiceCard({
  index,
  title,
  body,
  onSelect,
}: {
  index: string
  title: string
  body: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col items-start gap-4 border border-line p-8 text-start transition-colors hover:border-accent md:p-10"
    >
      <span className="font-display text-sm text-muted">{index}</span>
      <span className="font-display text-2xl text-paper transition-colors group-hover:text-accent md:text-3xl">
        {title}
      </span>
      <span className="text-sm leading-relaxed text-paper-dim">{body}</span>
    </button>
  )
}
