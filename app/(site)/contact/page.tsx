import type { Metadata } from "next"
import { ViewTransition } from "react"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { ContactForm } from "@/components/contact/ContactForm"
import { Reveal } from "@/components/motion/Reveal"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getSiteSettings } from "@/lib/queries/settings"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a production project with OPTKOR.",
}

export default async function ContactPage() {
  const [{ dict }, { data: settings }] = await Promise.all([getDictionary(), getSiteSettings()])

  return (
    <ViewTransition>
      <Container className="py-24 md:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Reveal>
              <Eyebrow>{dict.contact.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <Heading as="h1" size="xl" className="mt-6">
                {dict.contact.title}
              </Heading>
            </Reveal>
            <Reveal delay={0.18} className="mt-4 max-w-sm text-base text-paper-dim">
              <p>{dict.contact.subtitle}</p>
            </Reveal>

            {settings.contact_email && (
              <Reveal delay={0.26} className="mt-10 text-sm text-muted">
                <p>
                  {dict.contact.directEmail}{" "}
                  <a href={`mailto:${settings.contact_email}`} className="text-accent hover:underline">
                    {settings.contact_email}
                  </a>
                </p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.15}>
            <ContactForm dict={dict} />
          </Reveal>
        </div>
      </Container>
    </ViewTransition>
  )
}
