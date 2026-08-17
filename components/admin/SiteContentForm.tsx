"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Textarea } from "@/components/ui/FormField"
import { saveSiteContent } from "@/lib/mutations/site-content"
import { SITE_CONTENT_FIELDS } from "@/lib/data/site-content-fields"
import type { MutationState } from "@/lib/mutations/projects"
import en from "@/lib/i18n/dictionaries/en"
import ar from "@/lib/i18n/dictionaries/ar"

const initialState: MutationState = { status: "idle", message: "" }
const DEFAULTS = { en, ar } as const

function fieldName(locale: string, section: string, key: string) {
  return `${locale}__${section}__${key}`
}

function defaultValue(locale: "en" | "ar", section: string, key: string): string {
  const dict = DEFAULTS[locale] as Record<string, unknown>
  const sectionObj = dict[section]
  if (!sectionObj || typeof sectionObj !== "object") return ""
  const value = (sectionObj as Record<string, unknown>)[key]
  return typeof value === "string" ? value : ""
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Content"}
    </button>
  )
}

export function SiteContentForm({ overrides }: { overrides: Record<string, string> }) {
  const [state, formAction] = useActionState(saveSiteContent, initialState)

  const sections = Array.from(new Set(SITE_CONTENT_FIELDS.map((f) => f.section)))

  return (
    <form action={formAction} className="flex flex-col gap-12">
      {sections.map((section) => (
        <div key={section}>
          <h2 className="font-display text-lg capitalize text-paper">{section}</h2>
          <div className="mt-6 flex flex-col gap-8 border-t border-line pt-6">
            {SITE_CONTENT_FIELDS.filter((f) => f.section === section).map((field) => {
              const Control = field.type === "textarea" ? Textarea : Input
              return (
                <div key={`${field.section}.${field.key}`} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    label={`${field.label} (EN)`}
                    htmlFor={fieldName("en", field.section, field.key)}
                    hint="Leave blank to use the default copy."
                  >
                    <Control
                      id={fieldName("en", field.section, field.key)}
                      name={fieldName("en", field.section, field.key)}
                      placeholder={defaultValue("en", field.section, field.key)}
                      defaultValue={overrides[fieldName("en", field.section, field.key)] ?? ""}
                    />
                  </FormField>
                  <FormField
                    label={`${field.label} (AR)`}
                    htmlFor={fieldName("ar", field.section, field.key)}
                    hint="Leave blank to use the default copy."
                  >
                    <Control
                      id={fieldName("ar", field.section, field.key)}
                      name={fieldName("ar", field.section, field.key)}
                      dir="rtl"
                      placeholder={defaultValue("ar", field.section, field.key)}
                      defaultValue={overrides[fieldName("ar", field.section, field.key)] ?? ""}
                    />
                  </FormField>
                </div>
              )
            })}
          </div>
        </div>
      ))}

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
        <SubmitButton />
      </div>
    </form>
  )
}
