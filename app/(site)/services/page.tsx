import type { Metadata } from "next"
import { ViewTransition } from "react"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { ServiceIndex } from "@/components/services/ServiceIndex"
import { ErrorState } from "@/components/ui/States"
import { EmptyStateHero } from "@/components/ui/EmptyStateHero"
import { Reveal } from "@/components/motion/Reveal"
import { SectionCurtain } from "@/components/motion/SectionCurtain"
import { getPublishedServices } from "@/lib/queries/services"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary()
  return { title: dict.services.title, description: dict.services.subtitle }
}

export default async function ServicesPage() {
  const [{ dict }, { data, error }] = await Promise.all([
    getDictionary(),
    getPublishedServices(),
  ])
  const services = data ?? []

  return (
    <ViewTransition default="page-transition">
      <Container className="pt-24 pb-16 md:pt-32 md:pb-20">
        <Reveal>
          <Eyebrow>{dict.services.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h1" size="xl" className="mt-6 max-w-2xl">
            {dict.services.title}
          </Heading>
        </Reveal>
        <Reveal delay={0.18} className="mt-4 max-w-xl text-base text-paper-dim">
          <p>{dict.services.subtitle}</p>
        </Reveal>
      </Container>

      {error ? (
        <Container className="pb-24 md:pb-32">
          <ErrorState title={dict.common.somethingWrong} />
        </Container>
      ) : services.length === 0 ? (
        <SectionCurtain>
          <EmptyStateHero className="border-t border-line" eyebrow={dict.services.eyebrow} title={dict.services.empty} />
        </SectionCurtain>
      ) : (
        <SectionCurtain>
          <Container className="pb-24 md:pb-32">
            <ServiceIndex services={services} exploreLabel={dict.common.explore} />
          </Container>
        </SectionCurtain>
      )}
    </ViewTransition>
  )
}
