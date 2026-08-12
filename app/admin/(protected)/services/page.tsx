import Link from "next/link"
import { getAllServicesAdmin } from "@/lib/queries/services"
import { ServicesTable } from "@/components/admin/ServicesTable"
import { EmptyState, ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "Services — OPTKOR Admin" } }

export default async function AdminServicesPage() {
  const { data, error } = await getAllServicesAdmin()
  const services = data ?? []

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">Services</h1>
        <Link
          href="/admin/services/new"
          className="bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-ink hover:bg-accent-soft"
        >
          New Service
        </Link>
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState body={error} />
        ) : services.length === 0 ? (
          <EmptyState title="No services yet" body="Create your first service to get started." />
        ) : (
          <ServicesTable services={services} />
        )}
      </div>
    </div>
  )
}
