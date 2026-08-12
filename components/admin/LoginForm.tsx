"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signIn, type LoginState } from "@/lib/mutations/auth"
import { FormField, Input } from "@/components/ui/FormField"

const initialState: LoginState = { error: null }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormField label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FormField>
      <FormField label="Password" htmlFor="password" required>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FormField>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  )
}
