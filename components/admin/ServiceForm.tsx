"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Textarea } from "@/components/ui/FormField"
import type { MutationState } from "@/lib/mutations/projects"
import type { Service } from "@/lib/supabase/types"
import { slugify } from "@/lib/utils/slug"

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

export function ServiceForm({
  action,
  service,
  submitLabel,
}: {
  action: (prevState: MutationState, formData: FormData) => Promise<MutationState>
  service?: Service
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, initialState)
  const [slug, setSlug] = useState(service?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(service))

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title" required error={state.fieldErrors?.title?.[0]}>
          <Input
            id="title"
            name="title"
            required
            defaultValue={service?.title}
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value))
            }}
          />
        </FormField>
        <FormField label="Slug" htmlFor="slug" required error={state.fieldErrors?.slug?.[0]}>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(slugify(e.target.value))
            }}
          />
        </FormField>
        <FormField
          label="Icon (optional)"
          htmlFor="icon"
          error={state.fieldErrors?.icon?.[0]}
          hint="An icon name or short reference."
        >
          <Input id="icon" name="icon" defaultValue={service?.icon ?? ""} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sort_order">
          <Input id="sort_order" name="sort_order" type="number" defaultValue={service?.sort_order ?? 0} />
        </FormField>
      </div>

      <FormField label="Short Description" htmlFor="short_description" error={state.fieldErrors?.short_description?.[0]}>
        <Input id="short_description" name="short_description" maxLength={500} defaultValue={service?.short_description ?? ""} />
      </FormField>

      <FormField label="Description" htmlFor="description" error={state.fieldErrors?.description?.[0]}>
        <Textarea id="description" name="description" rows={8} defaultValue={service?.description ?? ""} />
      </FormField>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="featured" defaultChecked={service?.featured} className="accent-accent" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="published" defaultChecked={service?.published} className="accent-accent" />
          Published
        </label>
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
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
