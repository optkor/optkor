import Link from "next/link"
import { getSiteSettings } from "@/lib/queries/settings"
import { SettingsForm } from "@/components/admin/SettingsForm"
import { HomeSectionsForm } from "@/components/admin/HomeSectionsForm"
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm"
import { ErrorState } from "@/components/ui/States"
import { resolveHomeSections } from "@/lib/data/home-sections"

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
        <h2 className="font-display text-xl text-paper">Homepage Layout</h2>
        <p className="mt-2 text-sm text-muted">
          Reorder or hide sections on the homepage. The hero always stays first.
        </p>
        <div className="mt-6">
          <HomeSectionsForm initial={resolveHomeSections(settings.homepage_config)} />
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <h2 className="font-display text-xl text-paper">Change Password</h2>
        <p className="mt-2 text-sm text-muted">Update the password for your own account.</p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <h2 className="font-display text-xl text-paper">Admin Access</h2>
        <p className="mt-2 text-sm text-muted">
          Create accounts, reset passwords, or disable access for other administrators.
        </p>
        <div className="mt-6">
          <Link
            href="/admin/users"
            className="inline-block border border-line-strong px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-paper hover:border-accent hover:text-accent"
          >
            Manage Admin Users
          </Link>
        </div>
      </div>
    </div>
  )
}
