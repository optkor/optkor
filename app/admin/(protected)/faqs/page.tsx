import Link from "next/link"
import { getAllFaqsAdmin } from "@/lib/queries/faqs"
import { FaqsTable } from "@/components/admin/FaqsTable"
import { EmptyState, ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "FAQs — OPTKOR Admin" } }

export default async function AdminFaqsPage() {
  const { data, error } = await getAllFaqsAdmin()
  const faqs = data ?? []

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">FAQs</h1>
        <Link
          href="/admin/faqs/new"
          className="bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-ink hover:bg-accent-soft"
        >
          New FAQ
        </Link>
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState body={error} />
        ) : faqs.length === 0 ? (
          <EmptyState title="No FAQs yet" body="Add your first frequently asked question to get started." />
        ) : (
          <FaqsTable faqs={faqs} />
        )}
      </div>
    </div>
  )
}
