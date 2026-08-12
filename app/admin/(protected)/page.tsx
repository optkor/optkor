import Link from "next/link"
import { getDashboardStats } from "@/lib/queries/dashboard"
import { ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "Dashboard — OPTKOR Admin" } }

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="border border-line p-6 transition-colors hover:border-accent/40 hover:bg-ink-2"
    >
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-3 font-display text-4xl text-paper">{value}</p>
    </Link>
  )
}

export default async function AdminDashboardPage() {
  const { data: stats, error } = await getDashboardStats()

  if (error || !stats) {
    return <ErrorState body="Unable to load dashboard stats." />
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-paper">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">An overview of the site&apos;s current content.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published Projects" value={stats.publishedProjects} href="/admin/projects" />
        <StatCard label="Draft Projects" value={stats.draftProjects} href="/admin/projects" />
        <StatCard label="Featured Projects" value={stats.featuredProjects} href="/admin/projects" />
        <StatCard label="Total Projects" value={stats.totalProjects} href="/admin/projects" />
        <StatCard label="Published Services" value={stats.publishedServices} href="/admin/services" />
        <StatCard label="Total Services" value={stats.totalServices} href="/admin/services" />
        <StatCard label="New Messages" value={stats.newMessages} href="/admin/messages" />
        <StatCard label="Total Messages" value={stats.totalMessages} href="/admin/messages" />
      </div>
    </div>
  )
}
