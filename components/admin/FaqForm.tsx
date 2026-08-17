"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Textarea } from "@/components/ui/FormField"
import type { MutationState } from "@/lib/mutations/projects"
import type { Faq } from "@/lib/supabase/types"

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

export function FaqForm({
  action,
  faq,
  submitLabel,
}: {
  action: (prevState: MutationState, formData: FormData) => Promise<MutationState>
  faq?: Faq
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormField label="Question" htmlFor="question" required error={state.fieldErrors?.question?.[0]}>
        <Input id="question" name="question" required defaultValue={faq?.question} />
      </FormField>

      <FormField label="Answer" htmlFor="answer" required error={state.fieldErrors?.answer?.[0]}>
        <Textarea id="answer" name="answer" rows={6} required defaultValue={faq?.answer} />
      </FormField>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Category (optional)"
          htmlFor="category"
          error={state.fieldErrors?.category?.[0]}
          hint="Groups related questions together, e.g. Pricing, Process."
        >
          <Input id="category" name="category" defaultValue={faq?.category ?? ""} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sort_order">
          <Input id="sort_order" name="sort_order" type="number" defaultValue={faq?.sort_order ?? 0} />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-paper">
        <input type="checkbox" name="published" defaultChecked={faq?.published} className="accent-accent" />
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
