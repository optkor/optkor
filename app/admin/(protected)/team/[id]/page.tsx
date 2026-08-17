import Link from "next/link"
import { notFound } from "next/navigation"
import { getTeamMemberByIdAdmin } from "@/lib/queries/team"
import { TeamMemberForm } from "@/components/admin/TeamMemberForm"
import { updateTeamMember } from "@/lib/mutations/team"

export const metadata = { title: { absolute: "Edit Team Member — OPTKOR Admin" } }

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: member, error } = await getTeamMemberByIdAdmin(id)

  if (error || !member) {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/team" className="text-xs uppercase tracking-wider text-muted hover:text-accent">
        ← Team
      </Link>
      <h1 className="mt-4 font-display text-3xl text-paper">{member.name}</h1>
      <div className="mt-10">
        <TeamMemberForm action={updateTeamMember.bind(null, id)} member={member} submitLabel="Save Changes" />
      </div>
    </div>
  )
}
