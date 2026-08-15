"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Modal } from "@/components/ui/Modal"
import { FormField, Input } from "@/components/ui/FormField"
import { resetAdminPassword } from "@/lib/mutations/admin-users"
import type { MutationState } from "@/lib/mutations/projects"

const initialState: MutationState = { status: "idle", message: "" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Resetting…" : "Reset Password"}
    </button>
  )
}

export function ResetPasswordModal({
  open,
  onClose,
  targetUserId,
  targetEmail,
}: {
  open: boolean
  onClose: () => void
  targetUserId: string
  targetEmail: string
}) {
  const action = resetAdminPassword.bind(null, targetUserId)
  const [state, formAction] = useActionState(action, initialState)

  return (
    <Modal open={open} onClose={onClose} title="Reset Password">
      <p className="text-sm text-muted">
        Set a new password for <span className="text-paper">{targetEmail}</span>. They&apos;ll need it the
        next time they sign in — this doesn&apos;t reveal or affect their current password otherwise.
      </p>

      {state.status === "success" ? (
        <div className="mt-6">
          <p role="status" className="text-sm text-success">
            {state.message}
          </p>
          <button
            onClick={onClose}
            className="mt-6 border border-line-strong px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-paper hover:border-accent hover:text-accent"
          >
            Done
          </button>
        </div>
      ) : (
        <form action={formAction} className="mt-6 flex flex-col gap-5">
          <FormField
            label="New Password"
            htmlFor="reset_password"
            required
            hint="At least 10 characters, with a mix of letters and numbers."
            error={state.fieldErrors?.password?.[0]}
          >
            <Input id="reset_password" name="password" type="password" autoComplete="new-password" required />
          </FormField>
          <FormField
            label="Confirm New Password"
            htmlFor="reset_confirm_password"
            required
            error={state.fieldErrors?.confirm_password?.[0]}
          >
            <Input
              id="reset_confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
            />
          </FormField>

          {state.status === "error" && (
            <p role="alert" className="text-sm text-danger">
              {state.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted hover:text-paper"
            >
              Cancel
            </button>
            <SubmitButton />
          </div>
        </form>
      )}
    </Modal>
  )
}
