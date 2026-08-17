import Link from "next/link"
import { getAllTestimonialsAdmin } from "@/lib/queries/testimonials"
import { TestimonialsTable } from "@/components/admin/TestimonialsTable"
import { EmptyState, ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "Testimonials — OPTKOR Admin" } }

export default async function AdminTestimonialsPage() {
  const { data, error } = await getAllTestimonialsAdmin()
  const testimonials = data ?? []

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-ink hover:bg-accent-soft"
        >
          New Testimonial
        </Link>
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState body={error} />
        ) : testimonials.length === 0 ? (
          <EmptyState title="No testimonials yet" body="Add your first client testimonial to get started." />
        ) : (
          <TestimonialsTable testimonials={testimonials} />
        )}
      </div>
    </div>
  )
}
