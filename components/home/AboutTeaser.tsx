import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { Reveal, RevealWords } from "@/components/motion/Reveal"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function AboutTeaser({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <Reveal>
            <Eyebrow>{dict.home.aboutEyebrow}</Eyebrow>
          </Reveal>
          <Heading as="h2" size="xl" className="mt-6 max-w-xl">
            <RevealWords text={dict.home.aboutTitle} delay={0.1} />
          </Heading>
        </div>
        <Reveal delay={0.2} className="flex flex-col items-start gap-8">
          <p className="max-w-lg text-base leading-relaxed text-paper-dim">{dict.home.aboutBody}</p>
          <Button href="/about" variant="secondary">
            {dict.common.learnMore}
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
