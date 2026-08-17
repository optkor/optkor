import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ViewTransition } from "react"
import Link from "next/link"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { MagneticCta } from "@/components/ui/MagneticCta"
import { Reveal } from "@/components/motion/Reveal"
import { SectionCurtain } from "@/components/motion/SectionCurtain"
import { PACKAGES, PACKAGE_DETAILS } from "@/lib/data/packages"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getSiteSettings } from "@/lib/queries/settings"
import { getWhatsAppHref } from "@/lib/utils/whatsapp"

type Props = { params: Promise<{ slug: string }> }

const TIER_KEYS = ["tier1", "tier2", "tier3"] as const

function getTierIndex(slug: string) {
  return PACKAGES.findIndex((tier) => tier.slug === slug)
}

export async function generateStaticParams() {
  return PACKAGES.map((tier) => ({ slug: tier.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const index = getTierIndex(slug)
  const { dict } = await getDictionary()
  if (index === -1) return { title: dict.packages.notFoundTitle }

  const key = TIER_KEYS[index]
  return {
    title: dict.packages[`${key}Name`],
    description: dict.packages[`${key}Positioning`],
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const index = getTierIndex(slug)
  if (index === -1) notFound()

  const tier = PACKAGES[index]
  const [{ dict, locale }, { data: settings }] = await Promise.all([getDictionary(), getSiteSettings()])
  const detail = PACKAGE_DETAILS[locale][slug]

  const key = TIER_KEYS[index]
  const name = dict.packages[`${key}Name`]
  const badgeLabel = dict.packages[`${key}Badge`]
  const positioning = dict.packages[`${key}Positioning`]

  const whatsappHref = getWhatsAppHref(settings.contact_phone)
  const askHref = settings.contact_email
    ? `mailto:${settings.contact_email}?subject=${encodeURIComponent(`${dict.packages.requestingLabel}: ${name}`)}`
    : `/contact?package=${tier.slug}`

  const isPremium = tier.badge === "premium"

  return (
    <ViewTransition default="page-transition">
      <Container className="pt-24 pb-16 md:pt-32 md:pb-20">
        <Reveal>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
          >
            ← {dict.packages.backToPackages}
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex items-center gap-4">
            <span className="font-display text-sm text-muted">{String(tier.index).padStart(2, "0")}</span>
            {badgeLabel && (
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{badgeLabel}</span>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.18}>
          <Heading as="h1" size="display" className="mt-4 max-w-3xl">
            {name}
          </Heading>
        </Reveal>
        <Reveal delay={0.26} className="mt-6 max-w-xl text-base leading-relaxed text-paper-dim md:text-lg">
          <p>{positioning}</p>
        </Reveal>
      </Container>

      <SectionCurtain>
        <Container className="border-t border-line py-16 md:py-24">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-col gap-16">
              <div>
                <Eyebrow>{dict.packages.whatYouBuy}</Eyebrow>
                <p className="font-display mt-5 max-w-2xl text-2xl leading-snug text-paper md:text-3xl">
                  {detail.whatYouBuy}
                </p>
                {detail.notes && (
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {detail.notes.map((note) => (
                      <li key={note} className="text-sm text-accent">
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                <div>
                  <Eyebrow>{dict.packages.whatYouGet}</Eyebrow>
                  <ul className="mt-5 flex flex-col gap-3">
                    {detail.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-paper">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Eyebrow>{dict.packages.whatYouDontGet}</Eyebrow>
                  <ul className="mt-5 flex flex-col gap-3">
                    {detail.notIncludes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-paper-dim">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                <div>
                  <Eyebrow>{dict.packages.howItWorks}</Eyebrow>
                  <ul className="mt-5 flex flex-col gap-3">
                    {detail.workflow.map((item, i) => (
                      <li key={item} className="flex items-baseline gap-3 text-sm leading-relaxed text-paper">
                        <span aria-hidden className="font-display text-xs text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Eyebrow>{dict.packages.whoItsFor}</Eyebrow>
                  <ul className="mt-5 flex flex-col gap-3">
                    {detail.bestFor.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-paper">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Price + request panel — sticky on desktop so it stays in view while reading scope */}
            <div>
              <div
                className={`sticky top-32 flex flex-col gap-6 border p-8 md:p-10 ${
                  isPremium ? "border-paper bg-paper text-ink" : "border-line"
                }`}
              >
                <div>
                  <Eyebrow>{dict.packages.priceLabel}</Eyebrow>
                  <p className="font-display mt-4 text-5xl">
                    {tier.price}
                    <span className={`ms-1 text-base font-sans ${isPremium ? "text-ink/50" : "text-muted"}`}>
                      {tier.cadence}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <MagneticCta cursorLabel={dict.packages.requestCta}>
                    <Button href={`/contact?package=${tier.slug}`} variant={isPremium ? "secondary" : "primary"} className="w-full">
                      {dict.packages.requestCta}
                    </Button>
                  </MagneticCta>
                  <MagneticCta cursorVariant="explore" cursorLabel={dict.packages.askCta}>
                    <a
                      href={askHref}
                      className={`inline-flex w-full items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                        isPremium
                          ? "border border-ink/30 text-ink hover:border-ink hover:text-ink"
                          : "border border-line-strong text-paper hover:border-accent hover:text-accent"
                      }`}
                    >
                      {dict.packages.askCta}
                    </a>
                  </MagneticCta>
                </div>

                {(settings.contact_email || whatsappHref) && (
                  <div className={`flex flex-col gap-2 border-t pt-6 text-sm ${isPremium ? "border-ink/15" : "border-line"}`}>
                    {settings.contact_email && (
                      <a href={`mailto:${settings.contact_email}`} className="hover:text-accent">
                        {settings.contact_email}
                      </a>
                    )}
                    {whatsappHref && (
                      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                        {dict.packages.whatsapp}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </SectionCurtain>
    </ViewTransition>
  )
}
