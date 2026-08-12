"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { SafeImage } from "@/components/ui/Media"
import type { Project } from "@/lib/supabase/types"

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/work/${project.slug}`} className="group block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-3">
          {project.cover_image ? (
            <SafeImage
              src={project.cover_image}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <span className="font-display text-2xl">{project.title.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl text-paper transition-colors group-hover:text-accent">
              {project.title}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted">
              {[project.client, project.category].filter(Boolean).join(" · ")}
            </p>
          </div>
          {project.year && <span className="text-xs text-muted">{project.year}</span>}
        </div>
      </Link>
    </motion.div>
  )
}
