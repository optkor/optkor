import type { Metadata } from "next"
import { ViewTransition } from "react"
import { Hero } from "@/components/home/Hero"
import { Capabilities } from "@/components/home/Capabilities"
import { Process } from "@/components/home/Process"
import { AboutTeaser } from "@/components/home/AboutTeaser"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { CtaSection } from "@/components/home/CtaSection"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { EmptyStateHero } from "@/components/ui/EmptyStateHero"
import { ProjectGrid } from "@/components/work/ProjectGrid"
import { ErrorState } from "@/components/ui/States"
import { SectionCurtain } from "@/components/motion/SectionCurtain"
import { getPublishedProjects } from "@/lib/queries/projects"
import { getPublishedTestimonials } from "@/lib/queries/testimonials"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getSiteSettings } from "@/lib/queries/settings"
import { resolvePageMetadata } from "@/lib/seo/resolve-page-metadata"

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings()
  const metadata = await resolvePageMetadata("/", {
    title: settings.seo_title ?? "OPTKOR — Visual Production Company",
    description:
      settings.seo_description ??
      "OPTKOR is a B2B visual production partner for marketing agencies and brands.",
  })

  // The root layout's title template ("%s — OPTKOR") appends the site name
  // to any string title a page provides. The home page's title IS the site
  // name already, so it needs `absolute` to render as-is instead of
  // becoming "OPTKOR — Visual Production Company — OPTKOR".
  return { ...metadata, title: { absolute: metadata.title as string } }
}

export default async function HomePage() {
  const [{ dict }, { data: projects, error }, { data: testimonials }] = await Promise.all([
    getDictionary(),
    getPublishedProjects({ featuredOnly: true }),
    getPublishedTestimonials(),
  ])

  return (
    <ViewTransition default="page-transition">
      <Hero dict={dict} />

      {error ? (
        <section className="border-t border-line py-24 md:py-32">
          <SectionCurtain>
            <Container>
              <ErrorState title={dict.common.somethingWrong} />
            </Container>
          </SectionCurtain>
        </section>
      ) : projects && projects.length > 0 ? (
        <section className="border-t border-line py-24 md:py-32">
          <SectionCurtain>
            <Container>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Eyebrow>{dict.home.workEyebrow}</Eyebrow>
                  <Heading as="h2" size="xl" className="mt-6 max-w-xl">
                    {dict.home.workTitle}
                  </Heading>
                </div>
                <Button href="/work" variant="secondary">
                  {dict.common.viewAllWork}
                </Button>
              </div>

              <div className="mt-16">
                <ProjectGrid projects={projects} feature />
              </div>
            </Container>
          </SectionCurtain>
        </section>
      ) : (
        <SectionCurtain>
          <EmptyStateHero
            className="border-t border-line"
            eyebrow={dict.home.workEyebrow}
            title={dict.home.workTitle}
            body={dict.home.workEmpty}
          />
        </SectionCurtain>
      )}

      <SectionCurtain>
        <Capabilities dict={dict} />
      </SectionCurtain>
      <SectionCurtain>
        <Process dict={dict} />
      </SectionCurtain>
      <SectionCurtain>
        <AboutTeaser dict={dict} />
      </SectionCurtain>
      {testimonials && testimonials.length > 0 && (
        <SectionCurtain>
          <TestimonialsSection dict={dict} testimonials={testimonials} />
        </SectionCurtain>
      )}
      <SectionCurtain>
        <CtaSection dict={dict} />
      </SectionCurtain>
    </ViewTransition>
  )
}
