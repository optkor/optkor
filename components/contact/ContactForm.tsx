"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { submitContactMessage, type ContactState } from "@/lib/mutations/contact"
import { FormField, Input, Textarea, Select } from "@/components/ui/FormField"
import { Button } from "@/components/ui/Button"
import { Reveal } from "@/components/motion/Reveal"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

const initialState: ContactState = { status: "idle", message: "" }

function SubmitButton({ dict }: { dict: Dictionary }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? dict.contact.submitting : dict.contact.submit}
    </Button>
  )
}

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [state, formAction] = useActionState(submitContactMessage, initialState)

  if (state.status === "success") {
    return (
      <Reveal as="div" role="status" className="border border-accent/30 bg-ink-2 p-8">
        <p className="font-display text-2xl text-paper">{dict.contact.successTitle}</p>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
      </Reveal>
    )
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {/* Honeypot — hidden from real users, catches naive bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label={dict.contact.formName} htmlFor="name" required error={state.fieldErrors?.name?.[0]}>
          <Input id="name" name="name" required maxLength={200} />
        </FormField>
        <FormField label={dict.contact.formEmail} htmlFor="email" required error={state.fieldErrors?.email?.[0]}>
          <Input id="email" name="email" type="email" required maxLength={320} />
        </FormField>
        <FormField label={dict.contact.formCompany} htmlFor="company" error={state.fieldErrors?.company?.[0]}>
          <Input id="company" name="company" maxLength={200} />
        </FormField>
        <FormField label={dict.contact.formPhone} htmlFor="phone" error={state.fieldErrors?.phone?.[0]}>
          <Input id="phone" name="phone" type="tel" maxLength={50} />
        </FormField>
      </div>

      <FormField label={dict.contact.formSubject} htmlFor="subject" error={state.fieldErrors?.subject?.[0]}>
        <Input id="subject" name="subject" maxLength={300} />
      </FormField>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FormField label={dict.contact.formProjectType} htmlFor="project_type">
          <Select id="project_type" name="project_type" defaultValue="">
            <option value="">—</option>
            <option value="Visual Identity">Visual Identity</option>
            <option value="Social Design & Campaigns">Social Design & Campaigns</option>
            <option value="Motion Graphics">Motion Graphics</option>
            <option value="Video Editing">Video Editing</option>
            <option value="Photography">Photography</option>
            <option value="Other">Other</option>
          </Select>
        </FormField>
        <FormField label={dict.contact.formBudget} htmlFor="budget_range">
          <Select id="budget_range" name="budget_range" defaultValue="">
            <option value="">—</option>
            <option value="< $5,000">{"< $5,000"}</option>
            <option value="$5,000 – $15,000">$5,000 – $15,000</option>
            <option value="$15,000 – $50,000">$15,000 – $50,000</option>
            <option value="$50,000+">$50,000+</option>
          </Select>
        </FormField>
        <FormField label={dict.contact.formTimeline} htmlFor="timeline">
          <Select id="timeline" name="timeline" defaultValue="">
            <option value="">—</option>
            <option value="ASAP">ASAP</option>
            <option value="1–4 weeks">1–4 weeks</option>
            <option value="1–3 months">1–3 months</option>
            <option value="Flexible">Flexible</option>
          </Select>
        </FormField>
      </div>

      <FormField
        label={dict.contact.formMessage}
        htmlFor="message"
        required
        error={state.fieldErrors?.message?.[0]}
      >
        <Textarea id="message" name="message" required maxLength={5000} rows={6} />
      </FormField>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}

      <div>
        <SubmitButton dict={dict} />
      </div>
    </form>
  )
}
