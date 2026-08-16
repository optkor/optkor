import { ViewTransition } from "react"
import { Hero } from "@/components/home/Hero"
import { Capabilities } from "@/components/home/Capabilities"
import { Process } from "@/components/home/Process"
import { AboutTeaser } from "@/components/home/AboutTeaser"
import { CtaSection } from "@/components/home/CtaSection"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import { EmptyStateHero } from "@/components/ui/EmptyStateHero"
import { ProjectGrid } from "@/components/work/ProjectGrid"
import { ErrorState } from "@/components/ui/States"
import { getPublishedProjects } from "@/lib/queries/projects"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function HomePage() {
  const [{ dict }, { data: projects, error }] = await Promise.all([
    getDictionary(),
    getPublishedProjects({ featuredOnly: true }),
  ])

  return (
    <ViewTransition>
      <Hero dict={dict} />

      {error ? (
        <section className="border-t border-line py-24 md:py-32">
          <Container>
            <ErrorState body={dict.common.somethingWrong} />
          </Container>
        </section>
      ) : projects && projects.length > 0 ? (
        <section className="border-t border-line py-24 md:py-32">
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
              <ProjectGrid projects={projects} feature viewLabel={dict.common.viewProject} />
            </div>
          </Container>
        </section>
      ) : (
        <EmptyStateHero
          className="border-t border-line"
          eyebrow={dict.home.workEyebrow}
          title={dict.home.workTitle}
          body={dict.home.workEmpty}
        />
      )}

      <Capabilities dict={dict} />
      <Process dict={dict} />
      <AboutTeaser dict={dict} />
      <CtaSection dict={dict} />
    </ViewTransition>
  )
}
