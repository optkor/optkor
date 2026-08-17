import { getAllPageMetaAdmin } from "@/lib/queries/page-meta"
import { PAGE_META_PAGES } from "@/lib/data/page-meta-pages"
import { PageMetaForm } from "@/components/admin/PageMetaForm"
import { ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "SEO — OPTKOR Admin" } }

export default async function AdminSeoPage() {
  const { data, error } = await getAllPageMetaAdmin()

  const bySlug = new Map<string, string>(PAGE_META_PAGES.map((p) => [p.path, p.slug]))
  const values: Record<string, { seo_title: string; seo_description: string; og_image: string }> = {}
  for (const row of data ?? []) {
    const slug = bySlug.get(row.page_path)
    if (!slug) continue
    values[slug] = {
      seo_title: row.seo_title ?? "",
      seo_description: row.seo_description ?? "",
      og_image: row.og_image ?? "",
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-paper">SEO</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Override the title, description, and social share image for each top-level page. Leave a field
        blank to keep the page&apos;s default metadata.
      </p>

      <div className="mt-10 max-w-4xl">
        {error ? <ErrorState body={error} /> : <PageMetaForm values={values} />}
      </div>
    </div>
  )
}
