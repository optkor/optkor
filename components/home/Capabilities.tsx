import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function Capabilities({ dict }: { dict: Dictionary }) {
  const items = Object.values(dict.capabilities)

  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow>{dict.home.capabilitiesEyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <Heading as="h2" size="xl" className="mt-6 max-w-sm">
                {dict.home.capabilitiesTitle}
              </Heading>
            </Reveal>
          </div>

          <ul className="flex list-none flex-col border-t border-line">
            {items.map((item, index) => (
              <Reveal key={item} as="li" delay={Math.min(index * 0.06, 0.3)}>
                <div className="group flex items-baseline justify-between gap-6 border-b border-line py-6 transition-colors hover:border-accent/40 md:py-7">
                  <span className="font-display text-2xl text-paper transition duration-300 group-hover:translate-x-2 group-hover:text-accent md:text-3xl">
                    {item}
                  </span>
                  <span className="font-display text-sm text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
