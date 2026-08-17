import Link from "next/link"
import { FaqForm } from "@/components/admin/FaqForm"
import { createFaq } from "@/lib/mutations/faqs"

export const metadata = { title: { absolute: "New FAQ — OPTKOR Admin" } }

export default function NewFaqPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/faqs" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← FAQs
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">New FAQ</h1>
      <div className="mt-10">
        <FaqForm action={createFaq} submitLabel="Create FAQ" />
      </div>
    </div>
  )
}
