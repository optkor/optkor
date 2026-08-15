"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Select } from "@/components/ui/FormField"
import { createAdminAccount } from "@/lib/mutations/admin-users"
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
      {pending ? "Creating…" : "Create Admin"}
    </button>
  )
}

export function CreateAdminForm() {
  const [state, formAction] = useActionState(createAdminAccount, initialState)

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-6">
      <FormField label="Full Name" htmlFor="full_name" required error={state.fieldErrors?.full_name?.[0]}>
        <Input id="full_name" name="full_name" required autoComplete="name" />
      </FormField>
      <FormField label="Email" htmlFor="email" required error={state.fieldErrors?.email?.[0]}>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </FormField>
      <FormField label="Role" htmlFor="role">
        <Select id="role" name="role" defaultValue="admin" disabled>
          <option value="admin">Administrator</option>
        </Select>
      </FormField>
      <FormField
        label="Password"
        htmlFor="password"
        required
        hint="At least 10 characters, with a mix of letters and numbers."
        error={state.fieldErrors?.password?.[0]}
      >
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </FormField>
      <FormField
        label="Confirm Password"
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

      <p className="text-xs text-muted">
        The account is active immediately — no email confirmation step. Share the password with them securely.
      </p>

      <div>
        <SubmitButton />
      </div>
    </form>
  )
}
