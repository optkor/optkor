import Link from "next/link"
import { notFound } from "next/navigation"
import { getTestimonialByIdAdmin } from "@/lib/queries/testimonials"
import { TestimonialForm } from "@/components/admin/TestimonialForm"
import { updateTestimonial } from "@/lib/mutations/testimonials"

export const metadata = { title: { absolute: "Edit Testimonial — OPTKOR Admin" } }

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: testimonial, error } = await getTestimonialByIdAdmin(id)

  if (error || !testimonial) {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/testimonials" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Testimonials
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">{testimonial.client_name}</h1>
      <div className="mt-10">
        <TestimonialForm
          action={updateTestimonial.bind(null, id)}
          testimonial={testimonial}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}
