import type { Metadata } from "next"
import { ViewTransition } from "react"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import { PackageCard } from "@/components/packages/PackageCard"
import { PACKAGES } from "@/lib/data/packages"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getSiteSettings } from "@/lib/queries/settings"

export const metadata: Metadata = {
  title: "Packages",
  description: "Ongoing monthly production partnerships with OPTKOR.",
}

export default async function PackagesPage() {
  const [{ dict }, { data: settings }] = await Promise.all([getDictionary(), getSiteSettings()])

  const tierContent = [
    {
      name: dict.packages.tier1Name,
      badgeLabel: dict.packages.tier1Badge,
      positioning: dict.packages.tier1Positioning,
    },
    {
      name: dict.packages.tier2Name,
      badgeLabel: dict.packages.tier2Badge,
      positioning: dict.packages.tier2Positioning,
    },
    {
      name: dict.packages.tier3Name,
      badgeLabel: dict.packages.tier3Badge,
      positioning: dict.packages.tier3Positioning,
    },
  ]

  const whatsappHref = settings.contact_phone
    ? `https://wa.me/${settings.contact_phone.replace(/\D/g, "")}`
    : null

  return (
    <ViewTransition>
      <Container className="pt-24 pb-16 md:pt-32 md:pb-20">
        <Reveal>
          <Eyebrow>{dict.packages.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h1" size="xl" className="mt-6 max-w-2xl">
            {dict.packages.title}
          </Heading>
        </Reveal>
        <Reveal delay={0.18} className="mt-4 max-w-xl text-base text-paper-dim">
          <p>{dict.packages.subtitle}</p>
        </Reveal>
      </Container>

      <Container className="pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PACKAGES.map((tier, index) => (
            <PackageCard
              key={tier.slug}
              tier={tier}
              delay={Math.min(index * 0.08, 0.3)}
              requestLabel={dict.packages.requestCta}
              {...tierContent[index]}
            />
          ))}
        </div>

        {(settings.contact_email || whatsappHref) && (
          <Reveal
            delay={0.3}
            className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-10 text-sm"
          >
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="text-paper hover:text-accent">
                {settings.contact_email}
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper hover:text-accent"
              >
                {dict.packages.whatsapp}
              </a>
            )}
          </Reveal>
        )}
      </Container>
    </ViewTransition>
  )
}
