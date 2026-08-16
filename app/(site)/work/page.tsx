import type { Metadata } from "next"
import { Suspense, ViewTransition } from "react"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { ProjectGrid } from "@/components/work/ProjectGrid"
import { WorkFilter } from "@/components/work/WorkFilter"
import { ErrorState } from "@/components/ui/States"
import { EmptyStateHero } from "@/components/ui/EmptyStateHero"
import { SectionCurtain } from "@/components/motion/SectionCurtain"
import { getPublishedProjects, getProjectCategories } from "@/lib/queries/projects"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export const metadata: Metadata = {
  title: "Work",
  description: "Selected visual production work by OPTKOR for marketing agencies and brands.",
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const { dict } = await getDictionary()

  const [projectsRes, categoriesRes] = await Promise.all([
    getPublishedProjects({ category }),
    getProjectCategories(),
  ])

  const projects = projectsRes.data ?? []

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <Container className="pt-24 pb-16 md:pt-32 md:pb-20">
        <Eyebrow>{dict.work.eyebrow}</Eyebrow>
        <Heading as="h1" size="xl" className="mt-6 max-w-2xl">
          {dict.work.title}
        </Heading>
        <p className="mt-4 max-w-xl text-base text-paper-dim">{dict.work.subtitle}</p>

        {categoriesRes.data && categoriesRes.data.length > 0 && (
          <div className="mt-12">
            <Suspense fallback={null}>
              <WorkFilter categories={categoriesRes.data} allLabel={dict.work.filterAll} />
            </Suspense>
          </div>
        )}
      </Container>

      {projectsRes.error ? (
        <Container className="pb-24 md:pb-32">
          <ErrorState body={dict.common.somethingWrong} />
        </Container>
      ) : projects.length > 0 ? (
        <SectionCurtain>
          <Container className="pb-24 md:pb-32">
            <ProjectGrid projects={projects} feature viewLabel={dict.common.viewProject} />
          </Container>
        </SectionCurtain>
      ) : (
        <SectionCurtain>
          <EmptyStateHero className="border-t border-line" eyebrow={dict.work.eyebrow} title={dict.work.empty} />
        </SectionCurtain>
      )}
    </ViewTransition>
  )
}
