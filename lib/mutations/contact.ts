"use server"

import { createClient } from "@/lib/supabase/server"
import { getContactSchema } from "@/lib/validations/contact"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { ContactMessageInsert } from "@/lib/supabase/types"

export type ContactFieldValues = {
  name: string
  email: string
  company: string
  phone: string
  subject: string
  message: string
  project_type: string
  budget_range: string
  timeline: string
}

export type ContactState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors?: Record<string, string[] | undefined>
  values?: ContactFieldValues
}

export async function submitContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const { dict } = await getDictionary()
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    project_type: formData.get("project_type"),
    budget_range: formData.get("budget_range"),
    timeline: formData.get("timeline"),
    website: formData.get("website"),
  }

  // Submitted values, echoed back on error so the client can restore them
  // into the (uncontrolled) form fields — a failed submission must never
  // silently wipe out what the user typed.
  const values: ContactFieldValues = {
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    company: typeof raw.company === "string" ? raw.company : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    subject: typeof raw.subject === "string" ? raw.subject : "",
    message: typeof raw.message === "string" ? raw.message : "",
    project_type: typeof raw.project_type === "string" ? raw.project_type : "",
    budget_range: typeof raw.budget_range === "string" ? raw.budget_range : "",
    timeline: typeof raw.timeline === "string" ? raw.timeline : "",
  }

  const parsed = getContactSchema(dict).safeParse(raw)

  if (!parsed.success) {
    return {
      status: "error",
      message: dict.contact.validationError,
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    }
  }

  // Honeypot tripped: pretend success, drop silently.
  if (parsed.data.website) {
    return { status: "success", message: dict.contact.successBody }
  }

  const { website, ...payload } = parsed.data
  void website
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value === "" ? null : value])
  )
  // The message column is NOT NULL at the database level; the form makes it
  // optional for package/custom requests, so an empty submission still needs
  // a real string to insert.
  if (!cleanPayload.message) {
    cleanPayload.message = "(No additional message provided.)"
  }

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert(cleanPayload as ContactMessageInsert)

  if (error) {
    console.error("[submitContactMessage]", error.message)
    return {
      status: "error",
      message: dict.contact.errorGeneric,
      values,
    }
  }

  return {
    status: "success",
    message: dict.contact.successBody,
  }
}
