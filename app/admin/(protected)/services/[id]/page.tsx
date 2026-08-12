import Link from "next/link"
import { notFound } from "next/navigation"
import { getServiceByIdAdmin } from "@/lib/queries/services"
import { ServiceForm } from "@/components/admin/ServiceForm"
import { updateService } from "@/lib/mutations/services"

export const metadata = { title: { absolute: "Edit Service — OPTKOR Admin" } }

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: service, error } = await getServiceByIdAdmin(id)

  if (error || !service) {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/services" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Services
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">{service.title}</h1>
      <div className="mt-10">
        <ServiceForm action={updateService.bind(null, id)} service={service} submitLabel="Save Changes" />
      </div>
    </div>
  )
}
