"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Textarea } from "@/components/ui/FormField"
import { updateSiteSettings } from "@/lib/mutations/settings"
import type { MutationState } from "@/lib/mutations/projects"
import type { SiteSettings } from "@/lib/supabase/types"

const initialState: MutationState = { status: "idle", message: "" }

function isSocialLinks(value: unknown): value is Record<string, string | null> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Settings"}
    </button>
  )
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(updateSiteSettings, initialState)
  const social = isSocialLinks(settings.social_links) ? settings.social_links : {}

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Company Name" htmlFor="company_name" required error={state.fieldErrors?.company_name?.[0]}>
          <Input id="company_name" name="company_name" required defaultValue={settings.company_name} />
        </FormField>
        <FormField label="Tagline" htmlFor="tagline" error={state.fieldErrors?.tagline?.[0]}>
          <Input id="tagline" name="tagline" defaultValue={settings.tagline ?? ""} />
        </FormField>
        <FormField label="Contact Email" htmlFor="contact_email" error={state.fieldErrors?.contact_email?.[0]}>
          <Input id="contact_email" name="contact_email" type="email" defaultValue={settings.contact_email ?? ""} />
        </FormField>
        <FormField label="Contact Phone" htmlFor="contact_phone" error={state.fieldErrors?.contact_phone?.[0]}>
          <Input id="contact_phone" name="contact_phone" defaultValue={settings.contact_phone ?? ""} />
        </FormField>
      </div>

      <FormField label="Address" htmlFor="address" error={state.fieldErrors?.address?.[0]}>
        <Textarea id="address" name="address" rows={3} defaultValue={settings.address ?? ""} />
      </FormField>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="SEO Title" htmlFor="seo_title" error={state.fieldErrors?.seo_title?.[0]}>
          <Input id="seo_title" name="seo_title" defaultValue={settings.seo_title ?? ""} />
        </FormField>
        <FormField label="SEO Description" htmlFor="seo_description" error={state.fieldErrors?.seo_description?.[0]}>
          <Input id="seo_description" name="seo_description" defaultValue={settings.seo_description ?? ""} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FormField label="Instagram URL" htmlFor="instagram_url" error={state.fieldErrors?.instagram_url?.[0]}>
          <Input id="instagram_url" name="instagram_url" type="url" defaultValue={social.instagram ?? ""} />
        </FormField>
        <FormField label="LinkedIn URL" htmlFor="linkedin_url" error={state.fieldErrors?.linkedin_url?.[0]}>
          <Input id="linkedin_url" name="linkedin_url" type="url" defaultValue={social.linkedin ?? ""} />
        </FormField>
        <FormField label="Behance URL" htmlFor="behance_url" error={state.fieldErrors?.behance_url?.[0]}>
          <Input id="behance_url" name="behance_url" type="url" defaultValue={social.behance ?? ""} />
        </FormField>
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p role="status" className="text-sm text-success">
          {state.message}
        </p>
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  )
}
