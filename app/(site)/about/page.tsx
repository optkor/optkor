import type { Metadata } from "next"
import { ViewTransition } from "react"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { Reveal } from "@/components/motion/Reveal"
import { SectionCurtain } from "@/components/motion/SectionCurtain"
import { TeamSection } from "@/components/about/TeamSection"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getPublishedTeamMembers } from "@/lib/queries/team"
import { resolvePageMetadata } from "@/lib/seo/resolve-page-metadata"

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary()
  return resolvePageMetadata("/about", { title: dict.about.title, description: dict.home.aboutBody })
}

export default async function AboutPage() {
  const [{ dict }, { data: members }] = await Promise.all([getDictionary(), getPublishedTeamMembers()])
  const values = Object.entries(dict.about.values).reduce<
    { key: string; title: string; body: string }[]
  >((acc, [key, value]) => {
    if (key.endsWith("Body")) return acc
    const bodyKey = `${key}Body` as keyof typeof dict.about.values
    acc.push({ key, title: value, body: dict.about.values[bodyKey] })
    return acc
  }, [])

  return (
    <ViewTransition default="page-transition">
      <Container className="py-24 md:py-32">
        <Reveal>
          <Eyebrow>{dict.about.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h1" size="display" className="mt-6 max-w-4xl">
            {dict.about.title}
          </Heading>
        </Reveal>

        <div className="mt-16 flex max-w-2xl flex-col gap-8">
          <Reveal delay={0.2}>
            <p className="font-display text-2xl leading-snug text-paper md:text-3xl">{dict.about.body1}</p>
          </Reveal>
          <Reveal delay={0.28} className="flex flex-col gap-6 text-base leading-relaxed text-paper-dim">
            <p>{dict.about.body2}</p>
            <p>{dict.about.body3}</p>
          </Reveal>
        </div>
      </Container>

      <SectionCurtain>
        <section className="border-t border-line py-24">
          <Container>
            <Reveal>
              <Heading as="h2" size="lg" className="max-w-xl">
                {dict.about.valuesTitle}
              </Heading>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2">
              {values.map((value, index) => (
                <Reveal key={value.key} delay={Math.min(index * 0.08, 0.32)}>
                  <h3 className="font-display text-xl text-accent">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted">{value.body}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </SectionCurtain>

      {members && members.length > 0 && (
        <SectionCurtain>
          <TeamSection dict={dict} members={members} />
        </SectionCurtain>
      )}

      <SectionCurtain>
        <section className="field-grain border-t border-line py-24">
          <Container className="flex flex-col items-start gap-6">
            <Reveal>
              <Heading as="h2" size="lg" className="max-w-xl">
                {dict.home.ctaTitle}
              </Heading>
            </Reveal>
            <Reveal delay={0.1}>
              <Button href="/contact" size="lg">
                {dict.home.ctaButton}
              </Button>
            </Reveal>
          </Container>
        </section>
      </SectionCurtain>
    </ViewTransition>
  )
}
