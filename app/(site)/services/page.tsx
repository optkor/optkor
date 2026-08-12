import type { Metadata } from "next"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { ServiceCard } from "@/components/services/ServiceCard"
import { EmptyState, ErrorState } from "@/components/ui/States"
import { getPublishedServices } from "@/lib/queries/services"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export const metadata: Metadata = {
  title: "Services",
  description: "OPTKOR's visual production capabilities for marketing agencies and brands.",
}

export default async function ServicesPage() {
  const [{ dict }, { data, error }] = await Promise.all([
    getDictionary(),
    getPublishedServices(),
  ])
  const services = data ?? []

  return (
    <Container className="py-24 md:py-32">
      <Eyebrow>{dict.services.eyebrow}</Eyebrow>
      <Heading as="h1" size="xl" className="mt-6 max-w-2xl">
        {dict.services.title}
      </Heading>
      <p className="mt-4 max-w-xl text-base text-paper-dim">{dict.services.subtitle}</p>

      <div className="mt-16">
        {error ? (
          <ErrorState body={dict.common.somethingWrong} />
        ) : services.length === 0 ? (
          <EmptyState title={dict.services.empty} />
        ) : (
          <div>
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
