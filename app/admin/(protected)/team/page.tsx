import Link from "next/link"
import { getAllTeamMembersAdmin } from "@/lib/queries/team"
import { TeamMembersTable } from "@/components/admin/TeamMembersTable"
import { EmptyState, ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "Team — OPTKOR Admin" } }

export default async function AdminTeamPage() {
  const { data, error } = await getAllTeamMembersAdmin()
  const members = data ?? []

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-paper">Team</h1>
        <Link
          href="/admin/team/new"
          className="bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-ink hover:bg-accent-soft"
        >
          New Team Member
        </Link>
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState body={error} />
        ) : members.length === 0 ? (
          <EmptyState title="No team members yet" body="Add your first team member to get started." />
        ) : (
          <TeamMembersTable members={members} />
        )}
      </div>
    </div>
  )
}
