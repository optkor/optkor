import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ViewTransition } from "react"
import Link from "next/link"
import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { MediaGallery } from "@/components/work/MediaGallery"
import { ProjectGrid } from "@/components/work/ProjectGrid"
import { Reveal } from "@/components/motion/Reveal"
import { SectionCurtain } from "@/components/motion/SectionCurtain"
import { CaseStudyHeroImage } from "@/components/work/CaseStudyHeroImage"
import { getProjectBySlug, getRelatedProjects } from "@/lib/queries/projects"
import { getDictionary } from "@/lib/i18n/get-dictionary"

type Props = { params: Promise<{ slug: string }> }

const transition = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "page-transition",
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: project } = await getProjectBySlug(slug)

  if (!project) {
    return { title: "Project not found" }
  }

  return {
    title: project.title,
    description: project.short_description ?? project.description ?? undefined,
    openGraph: {
      title: project.title,
      description: project.short_description ?? undefined,
      images: project.cover_image ? [project.cover_image] : [],
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const { dict } = await getDictionary()
  const { data: project } = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const { data: related } = await getRelatedProjects(project.slug, project.category)

  return (
    <ViewTransition enter={transition} exit={transition} default="none">
      <article>
        <Container className="pt-24 md:pt-32">
          <Link
            href="/work"
            transitionTypes={["nav-back"]}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
          >
            ← {dict.nav.work}
          </Link>

          <Reveal delay={0.1}>
            <Eyebrow className="mt-8">
              {[project.category, project.year].filter(Boolean).join(" · ") || dict.caseStudy.category}
            </Eyebrow>
          </Reveal>
          <ViewTransition name={`project-title-${project.id}`} share="auto">
            <Heading as="h1" size="display" className="mt-6 max-w-4xl">
              {project.title}
            </Heading>
          </ViewTransition>

          <Reveal
            delay={0.28}
            className="mt-10 grid grid-cols-2 gap-8 border-t border-line pt-8 sm:grid-cols-3 sm:max-w-xl"
          >
            <dl className="contents">
              {project.client && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">{dict.caseStudy.client}</dt>
                  <dd className="mt-1 text-sm text-paper">{project.client}</dd>
                </div>
              )}
              {project.category && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">{dict.caseStudy.category}</dt>
                  <dd className="mt-1 text-sm text-paper">{project.category}</dd>
                </div>
              )}
              {project.year && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">{dict.caseStudy.year}</dt>
                  <dd className="mt-1 text-sm text-paper">{project.year}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </Container>

        {project.cover_image && (
          <CaseStudyHeroImage
            src={project.cover_image}
            alt={project.title}
            transitionName={`project-${project.id}`}
          />
        )}

        <Container className="py-16 md:py-24">
          {project.description && (
            <p className="max-w-2xl whitespace-pre-line text-base leading-relaxed text-paper-dim">
              {project.description}
            </p>
          )}

          {project.project_media.length > 0 && (
            <div className="mt-16">
              <Eyebrow>{dict.caseStudy.gallery}</Eyebrow>
              <div className="mt-8">
                <MediaGallery media={project.project_media} />
              </div>
            </div>
          )}
        </Container>

        {related && related.length > 0 && (
          <SectionCurtain>
            <Container className="border-t border-line py-24">
              <Eyebrow>{dict.caseStudy.related}</Eyebrow>
              <div className="mt-10">
                <ProjectGrid projects={related} viewLabel={dict.common.viewProject} />
              </div>
            </Container>
          </SectionCurtain>
        )}
      </article>
    </ViewTransition>
  )
}
