import Link from "next/link"
import { ServiceForm } from "@/components/admin/ServiceForm"
import { createService } from "@/lib/mutations/services"

export const metadata = { title: { absolute: "New Service — OPTKOR Admin" } }

export default function NewServicePage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/services" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Services
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">New Service</h1>
      <div className="mt-10">
        <ServiceForm action={createService} submitLabel="Create Service" />
      </div>
    </div>
  )
}
