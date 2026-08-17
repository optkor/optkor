import type { Metadata } from "next"
import { ViewTransition } from "react"
import { Container } from "@/components/ui/Container"
import { StartProjectFlow } from "@/components/contact/StartProjectFlow"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getSiteSettings } from "@/lib/queries/settings"
import { getWhatsAppHref } from "@/lib/utils/whatsapp"
import { PACKAGES } from "@/lib/data/packages"

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary()
  return { title: dict.contact.title, description: dict.contact.subtitle }
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; custom?: string }>
}) {
  const [{ dict, locale }, { data: settings }, { package: packageSlug, custom }] = await Promise.all([
    getDictionary(),
    getSiteSettings(),
    searchParams,
  ])

  const tierNames = [dict.packages.tier1Name, dict.packages.tier2Name, dict.packages.tier3Name]
  const packageIndex = PACKAGES.findIndex((tier) => tier.slug === packageSlug)
  const isPackageMode = packageIndex >= 0
  const isCustomMode = !isPackageMode && custom === "1"
  const initialMode = isPackageMode ? "package" : isCustomMode ? "custom" : null

  const whatsappHref = getWhatsAppHref(settings.contact_phone)

  return (
    <ViewTransition default="page-transition">
      <Container>
        <StartProjectFlow
          key={locale}
          dict={dict}
          packages={PACKAGES}
          tierNames={tierNames}
          initialMode={initialMode}
          initialPackageSlug={isPackageMode ? PACKAGES[packageIndex].slug : null}
          whatsappHref={whatsappHref}
          contactEmail={settings.contact_email}
          contactPhone={settings.contact_phone}
        />
      </Container>
    </ViewTransition>
  )
}
