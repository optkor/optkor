import type { Metadata } from "next"
import { ViewTransition } from "react"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { ContactForm } from "@/components/contact/ContactForm"
import { Reveal } from "@/components/motion/Reveal"
import { SectionCurtain } from "@/components/motion/SectionCurtain"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getSiteSettings } from "@/lib/queries/settings"
import { getWhatsAppHref } from "@/lib/utils/whatsapp"
import { PACKAGES } from "@/lib/data/packages"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a production project with OPTKOR.",
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; custom?: string }>
}) {
  const [{ dict }, { data: settings }, { package: packageSlug, custom }] = await Promise.all([
    getDictionary(),
    getSiteSettings(),
    searchParams,
  ])

  const tierNames = [dict.packages.tier1Name, dict.packages.tier2Name, dict.packages.tier3Name]
  const packageIndex = PACKAGES.findIndex((tier) => tier.slug === packageSlug)
  const isPackageMode = packageIndex >= 0
  const isCustomMode = !isPackageMode && custom === "1"
  const packageName = isPackageMode ? tierNames[packageIndex] : null
  const packagePrice = isPackageMode
    ? `${PACKAGES[packageIndex].price}${PACKAGES[packageIndex].cadence}`
    : null

  const whatsappHref = getWhatsAppHref(settings.contact_phone)

  const pageTitle = isPackageMode
    ? packageName
    : isCustomMode
      ? dict.packages.customTitle
      : dict.contact.title
  const pageSubtitle = isPackageMode
    ? dict.contact.subtitle
    : isCustomMode
      ? dict.packages.customBody
      : dict.contact.subtitle

  return (
    <ViewTransition default="page-transition">
      <Container className="pt-24 pb-16 md:pt-32 md:pb-20">
        <Reveal>
          <Eyebrow>{isPackageMode ? dict.packages.requestingLabel : isCustomMode ? dict.packages.customRequesting : dict.contact.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h1" size="display" className="mt-6 max-w-3xl">
            {pageTitle}
          </Heading>
        </Reveal>
        <Reveal delay={0.18} className="mt-6 max-w-md text-base text-paper-dim md:text-lg">
          <p>{pageSubtitle}</p>
        </Reveal>
      </Container>

      <SectionCurtain>
        <Container className="grid grid-cols-1 gap-16 border-t border-line pt-16 pb-24 md:pb-32 lg:grid-cols-[1fr_1.4fr]">
          <div>
            {settings.contact_email && (
              <Reveal className="text-sm text-muted">
                <p>
                  {dict.contact.directEmail}{" "}
                  <a href={`mailto:${settings.contact_email}`} className="text-accent hover:underline">
                    {settings.contact_email}
                  </a>
                </p>
              </Reveal>
            )}
            {settings.contact_phone && (
              <Reveal delay={0.08} className="mt-4 text-sm text-muted">
                <p>
                  <a href={`tel:${settings.contact_phone}`} className="text-accent hover:underline">
                    {settings.contact_phone}
                  </a>
                </p>
              </Reveal>
            )}
            {whatsappHref && (
              <Reveal delay={0.14} className="mt-4 text-sm text-muted">
                <p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {dict.packages.whatsapp}
                  </a>
                </p>
              </Reveal>
            )}
          </div>

          <ContactForm
            dict={dict}
            mode={isPackageMode ? "package" : isCustomMode ? "custom" : "general"}
            packageName={packageName}
            packagePrice={packagePrice}
            requestingLabel={dict.packages.requestingLabel}
          />
        </Container>
      </SectionCurtain>
    </ViewTransition>
  )
}
