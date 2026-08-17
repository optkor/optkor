import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { AccentBlob } from "@/components/ui/AccentBlob"
import { MagneticCta } from "@/components/ui/MagneticCta"
import { Reveal } from "@/components/motion/Reveal"
import { FrameMark } from "@/components/motion/FrameMark"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function CtaSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="field-grain relative overflow-hidden border-t border-line py-28 md:py-40">
      <AccentBlob className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 text-accent/20 md:h-64 md:w-64" />
      <FrameMark className="m-6 md:m-10" />
      <Container className="relative flex flex-col items-start gap-8">
        <Reveal>
          <Eyebrow>{dict.home.ctaEyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h2" size="xl" className="max-w-2xl">
            {dict.home.ctaTitle}
          </Heading>
        </Reveal>
        <Reveal delay={0.2} className="max-w-lg text-base text-paper-dim">
          <p>{dict.home.ctaBody}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <MagneticCta className="w-fit">
            <Button href="/contact" variant="primary" size="lg">
              {dict.home.ctaButton}
            </Button>
          </MagneticCta>
        </Reveal>
      </Container>
    </section>
  )
}
