"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Textarea } from "@/components/ui/FormField"
import type { MutationState } from "@/lib/mutations/projects"
import type { Testimonial } from "@/lib/supabase/types"

const initialState: MutationState = { status: "idle", message: "" }

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

export function TestimonialForm({
  action,
  testimonial,
  submitLabel,
}: {
  action: (prevState: MutationState, formData: FormData) => Promise<MutationState>
  testimonial?: Testimonial
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormField label="Quote" htmlFor="quote" required error={state.fieldErrors?.quote?.[0]}>
        <Textarea id="quote" name="quote" rows={5} required defaultValue={testimonial?.quote} />
      </FormField>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Client Name" htmlFor="client_name" required error={state.fieldErrors?.client_name?.[0]}>
          <Input id="client_name" name="client_name" required defaultValue={testimonial?.client_name} />
        </FormField>
        <FormField label="Client Title" htmlFor="client_title" error={state.fieldErrors?.client_title?.[0]}>
          <Input id="client_title" name="client_title" defaultValue={testimonial?.client_title ?? ""} />
        </FormField>
        <FormField label="Client Company" htmlFor="client_company" error={state.fieldErrors?.client_company?.[0]}>
          <Input id="client_company" name="client_company" defaultValue={testimonial?.client_company ?? ""} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sort_order">
          <Input id="sort_order" name="sort_order" type="number" defaultValue={testimonial?.sort_order ?? 0} />
        </FormField>
      </div>

      <FormField
        label="Avatar URL (optional)"
        htmlFor="avatar_url"
        error={state.fieldErrors?.avatar_url?.[0]}
        hint="Upload the image via Settings → Media, or paste a URL."
      >
        <Input id="avatar_url" name="avatar_url" defaultValue={testimonial?.avatar_url ?? ""} />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-paper">
        <input type="checkbox" name="published" defaultChecked={testimonial?.published} className="accent-accent" />
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
