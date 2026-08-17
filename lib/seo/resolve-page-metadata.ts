import type { Metadata } from "next"
import { getPageMetaOverride } from "@/lib/queries/page-meta"

export async function resolvePageMetadata(
  path: string,
  fallback: { title: string; description: string }
): Promise<Metadata> {
  const { data: override } = await getPageMetaOverride(path)

  const title = override?.seo_title || fallback.title
  const description = override?.seo_description || fallback.description
  const images = override?.og_image ? [override.og_image] : undefined

  return {
    title,
    description,
    openGraph: { title, description, ...(images && { images }) },
    twitter: { title, description, ...(images && { images }) },
  }
}
