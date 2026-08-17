import Link from "next/link"
import { TestimonialForm } from "@/components/admin/TestimonialForm"
import { createTestimonial } from "@/lib/mutations/testimonials"

export const metadata = { title: { absolute: "New Testimonial — OPTKOR Admin" } }

export default function NewTestimonialPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/testimonials" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Testimonials
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">New Testimonial</h1>
      <div className="mt-10">
        <TestimonialForm action={createTestimonial} submitLabel="Create Testimonial" />
      </div>
    </div>
  )
}
