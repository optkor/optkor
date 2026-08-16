"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { requestPasswordReset, type ForgotPasswordState } from "@/lib/mutations/auth"
import { FormField, Input } from "@/components/ui/FormField"

const initialState: ForgotPasswordState = { status: "idle", message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send Reset Link"}
    </button>
  )
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState)

  if (state.status === "success") {
    return (
      <div role="status" className="border border-success/40 bg-ink-2 p-6 text-center">
        <p className="text-sm text-paper">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormField label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" autoComplete="email" required />
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
