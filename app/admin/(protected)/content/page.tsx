import { getAllSiteContentAdmin } from "@/lib/queries/site-content"
import { SiteContentForm } from "@/components/admin/SiteContentForm"
import { ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "Site Content — OPTKOR Admin" } }

export default async function AdminSiteContentPage() {
  const { data, error } = await getAllSiteContentAdmin()

  const overrides: Record<string, string> = {}
  for (const row of data ?? []) {
    overrides[`${row.locale}__${row.section}__${row.key}`] = row.value
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-paper">Site Content</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Override headlines, copy, and button labels across the homepage, navigation, footer, about, and
        contact pages. Leave a field blank to keep the site&apos;s default copy.
      </p>

      <div className="mt-10 max-w-4xl">
        {error ? <ErrorState body={error} /> : <SiteContentForm overrides={overrides} />}
      </div>
    </div>
  )
}
