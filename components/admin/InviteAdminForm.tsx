"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input } from "@/components/ui/FormField"
import { inviteAdmin } from "@/lib/mutations/admin-users"
import type { MutationState } from "@/lib/mutations/projects"

const initialState: MutationState = { status: "idle", message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-line-strong px-6 py-3 text-sm font-medium uppercase tracking-wide text-paper hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send Invite"}
    </button>
  )
}

export function InviteAdminForm() {
  const [state, formAction] = useActionState(inviteAdmin, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <FormField label="Admin Email" htmlFor="invite_email" className="flex-1">
        <Input id="invite_email" name="email" type="email" required />
      </FormField>
      <SubmitButton />
      {state.message && (
        <p className={`text-sm sm:ml-4 ${state.status === "error" ? "text-danger" : "text-success"}`}>
          {state.message}
        </p>
      )}
    </form>
  )
}
