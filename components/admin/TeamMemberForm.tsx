"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Textarea } from "@/components/ui/FormField"
import type { MutationState } from "@/lib/mutations/projects"
import type { TeamMember } from "@/lib/supabase/types"

const initialState: MutationState = { status: "idle", message: "" }

function isSocialLinks(value: unknown): value is Record<string, string | null> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  )
}

export function TeamMemberForm({
  action,
  member,
  submitLabel,
}: {
  action: (prevState: MutationState, formData: FormData) => Promise<MutationState>
  member?: TeamMember
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, initialState)
  const social = isSocialLinks(member?.social_links) ? member.social_links : {}

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" required error={state.fieldErrors?.name?.[0]}>
          <Input id="name" name="name" required defaultValue={member?.name} />
        </FormField>
        <FormField label="Role" htmlFor="role" required error={state.fieldErrors?.role?.[0]}>
          <Input id="role" name="role" required defaultValue={member?.role} />
        </FormField>
      </div>

      <FormField label="Bio (optional)" htmlFor="bio" error={state.fieldErrors?.bio?.[0]}>
        <Textarea id="bio" name="bio" rows={4} defaultValue={member?.bio ?? ""} />
      </FormField>

      <FormField
        label="Photo URL (optional)"
        htmlFor="photo_url"
        error={state.fieldErrors?.photo_url?.[0]}
        hint="Upload the image via Settings → Media, or paste a URL."
      >
        <Input id="photo_url" name="photo_url" defaultValue={member?.photo_url ?? ""} />
      </FormField>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="LinkedIn URL" htmlFor="linkedin_url" error={state.fieldErrors?.linkedin_url?.[0]}>
          <Input id="linkedin_url" name="linkedin_url" type="url" defaultValue={social.linkedin ?? ""} />
        </FormField>
        <FormField label="Instagram URL" htmlFor="instagram_url" error={state.fieldErrors?.instagram_url?.[0]}>
          <Input id="instagram_url" name="instagram_url" type="url" defaultValue={social.instagram ?? ""} />
        </FormField>
      </div>

      <FormField label="Sort Order" htmlFor="sort_order" className="max-w-[200px]">
        <Input id="sort_order" name="sort_order" type="number" defaultValue={member?.sort_order ?? 0} />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-paper">
        <input type="checkbox" name="published" defaultChecked={member?.published} className="accent-accent" />
        Published
      </label>

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
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
