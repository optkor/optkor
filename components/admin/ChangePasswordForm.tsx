"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input } from "@/components/ui/FormField"
import { changeOwnPassword } from "@/lib/mutations/auth"
import type { MutationState } from "@/lib/mutations/projects"

const initialState: MutationState = { status: "idle", message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Changing…" : "Change Password"}
    </button>
  )
}

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changeOwnPassword, initialState)

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-6">
      <FormField
        label="Current Password"
        htmlFor="current_password"
        required
        error={state.fieldErrors?.current_password?.[0]}
      >
        <Input id="current_password" name="current_password" type="password" autoComplete="current-password" required />
      </FormField>
      <FormField
        label="New Password"
        htmlFor="new_password"
        required
        hint="At least 10 characters, with a mix of letters and numbers."
        error={state.fieldErrors?.new_password?.[0]}
      >
        <Input id="new_password" name="new_password" type="password" autoComplete="new-password" required />
      </FormField>
      <FormField
        label="Confirm New Password"
        htmlFor="confirm_password"
        required
        error={state.fieldErrors?.confirm_password?.[0]}
      >
        <Input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" required />
      </FormField>

      {state.status === "error" && !state.fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}

      <p className="text-xs text-muted">
        Changing your password signs you out everywhere, including this session — you&apos;ll need to sign in again.
      </p>

      <div>
        <SubmitButton />
      </div>
    </form>
  )
}
