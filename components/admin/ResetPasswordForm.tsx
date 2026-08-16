"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { setNewPasswordFromRecovery } from "@/lib/mutations/auth"
import { FormField, Input } from "@/components/ui/FormField"
import type { MutationState } from "@/lib/mutations/projects"

const initialState: MutationState = { status: "idle", message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Saving…" : "Set New Password"}
    </button>
  )
}

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(setNewPasswordFromRecovery, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormField
        label="New Password"
        htmlFor="password"
        required
        hint="At least 10 characters, with a mix of letters and numbers."
        error={state.fieldErrors?.password?.[0]}
      >
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </FormField>
      <FormField
        label="Confirm New Password"
        htmlFor="confirm_password"
        required
        error={state.fieldErrors?.confirm_password?.[0]}
      >
        <Input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" required />
      </FormField>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
      <SubmitButton />
    </form>
  )
}
