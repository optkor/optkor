import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { AccentBlob } from "@/components/ui/AccentBlob"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function CtaSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="field-grain relative overflow-hidden border-t border-line py-28 md:py-40">
      <AccentBlob className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 text-accent/20 md:h-64 md:w-64" />
      <Container className="relative flex flex-col items-start gap-8">
        <Eyebrow>{dict.home.ctaEyebrow}</Eyebrow>
        <Heading as="h2" size="xl" className="max-w-2xl">
          {dict.home.ctaTitle}
        </Heading>
        <p className="max-w-lg text-base text-paper-dim">{dict.home.ctaBody}</p>
        <Button href="/contact" variant="primary" size="lg">
          {dict.home.ctaButton}
        </Button>
      </Container>
    </section>
  )
}
