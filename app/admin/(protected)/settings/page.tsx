import { getSiteSettings } from "@/lib/queries/settings"
import { SettingsForm } from "@/components/admin/SettingsForm"
import { InviteAdminForm } from "@/components/admin/InviteAdminForm"
import { ErrorState } from "@/components/ui/States"

export const metadata = { title: { absolute: "Settings — OPTKOR Admin" } }

export default async function AdminSettingsPage() {
  const { data: settings, error } = await getSiteSettings()

  if (error) {
    return <ErrorState body={error} />
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-paper">Settings</h1>
      <p className="mt-2 text-sm text-muted">Global site content and configuration.</p>

      <div className="mt-10">
        <SettingsForm settings={settings} />
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <h2 className="font-display text-xl text-paper">Admin Access</h2>
        <p className="mt-2 text-sm text-muted">
          Invite another admin by email. They&apos;ll receive a Supabase invite to set their password.
        </p>
        <div className="mt-6">
          <InviteAdminForm />
        </div>
      </div>
    </div>
  )
}
