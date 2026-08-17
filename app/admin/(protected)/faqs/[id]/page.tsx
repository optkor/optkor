import Link from "next/link"
import { notFound } from "next/navigation"
import { getFaqByIdAdmin } from "@/lib/queries/faqs"
import { FaqForm } from "@/components/admin/FaqForm"
import { updateFaq } from "@/lib/mutations/faqs"

export const metadata = { title: { absolute: "Edit FAQ — OPTKOR Admin" } }

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: faq, error } = await getFaqByIdAdmin(id)

  if (error || !faq) {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/faqs" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← FAQs
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">{faq.question}</h1>
      <div className="mt-10">
        <FaqForm action={updateFaq.bind(null, id)} faq={faq} submitLabel="Save Changes" />
      </div>
    </div>
  )
}
