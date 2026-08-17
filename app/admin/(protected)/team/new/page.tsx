import Link from "next/link"
import { TeamMemberForm } from "@/components/admin/TeamMemberForm"
import { createTeamMember } from "@/lib/mutations/team"

export const metadata = { title: { absolute: "New Team Member — OPTKOR Admin" } }

export default function NewTeamMemberPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/team" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Team
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">New Team Member</h1>
      <div className="mt-10">
        <TeamMemberForm action={createTeamMember} submitLabel="Create Team Member" />
      </div>
    </div>
  )
}
