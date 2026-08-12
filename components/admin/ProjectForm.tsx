"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Textarea } from "@/components/ui/FormField"
import type { MutationState } from "@/lib/mutations/projects"
import type { Project } from "@/lib/supabase/types"
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

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (prevState: MutationState, formData: FormData) => Promise<MutationState>
  project?: Project
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, initialState)
  const [slug, setSlug] = useState(project?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(project))

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title" required error={state.fieldErrors?.title?.[0]}>
          <Input
            id="title"
            name="title"
            required
            defaultValue={project?.title}
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
        <FormField label="Client" htmlFor="client" error={state.fieldErrors?.client?.[0]}>
          <Input id="client" name="client" defaultValue={project?.client ?? ""} />
        </FormField>
        <FormField label="Category" htmlFor="category" error={state.fieldErrors?.category?.[0]}>
          <Input id="category" name="category" defaultValue={project?.category ?? ""} />
        </FormField>
        <FormField label="Year" htmlFor="year" error={state.fieldErrors?.year?.[0]}>
          <Input id="year" name="year" type="number" min={1990} max={2100} defaultValue={project?.year ?? ""} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sort_order">
          <Input id="sort_order" name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} />
        </FormField>
      </div>

      <FormField
        label="Short Description"
        htmlFor="short_description"
        error={state.fieldErrors?.short_description?.[0]}
        hint="Used in project cards and previews."
      >
        <Input id="short_description" name="short_description" maxLength={500} defaultValue={project?.short_description ?? ""} />
      </FormField>

      <FormField label="Description" htmlFor="description" error={state.fieldErrors?.description?.[0]}>
        <Textarea id="description" name="description" rows={8} defaultValue={project?.description ?? ""} />
      </FormField>

      <input type="hidden" name="cover_image" value={project?.cover_image ?? ""} />

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} className="accent-accent" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-paper">
          <input type="checkbox" name="published" defaultChecked={project?.published} className="accent-accent" />
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
