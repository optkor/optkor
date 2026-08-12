import type { Metadata } from "next"
import { Suspense } from "react"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { ProjectGrid } from "@/components/work/ProjectGrid"
import { WorkFilter } from "@/components/work/WorkFilter"
import { ErrorState } from "@/components/ui/States"
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

  return (
    <Container className="py-24 md:py-32">
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

      <div className="mt-16">
        {projectsRes.error ? (
          <ErrorState body={dict.common.somethingWrong} />
        ) : (
          <ProjectGrid projects={projectsRes.data ?? []} emptyTitle={dict.work.empty} />
        )}
      </div>
    </Container>
  )
}
