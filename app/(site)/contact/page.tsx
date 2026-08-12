import type { Metadata } from "next"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { ContactForm } from "@/components/contact/ContactForm"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getSiteSettings } from "@/lib/queries/settings"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a production project with OPTKOR.",
}

export default async function ContactPage() {
  const [{ dict }, { data: settings }] = await Promise.all([getDictionary(), getSiteSettings()])

  return (
    <Container className="py-24 md:py-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>{dict.contact.eyebrow}</Eyebrow>
          <Heading as="h1" size="xl" className="mt-6">
            {dict.contact.title}
          </Heading>
          <p className="mt-4 max-w-sm text-base text-paper-dim">{dict.contact.subtitle}</p>

          {settings.contact_email && (
            <p className="mt-10 text-sm text-muted">
              {dict.contact.directEmail}{" "}
              <a href={`mailto:${settings.contact_email}`} className="text-accent hover:underline">
                {settings.contact_email}
              </a>
            </p>
          )}
        </div>

        <ContactForm dict={dict} />
      </div>
    </Container>
  )
}
