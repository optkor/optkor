"use server"

import { createClient } from "@/lib/supabase/server"
import { contactSchema } from "@/lib/validations/contact"
import type { ContactMessageInsert } from "@/lib/supabase/types"

export type ContactState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors?: Record<string, string[] | undefined>
}

export async function submitContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
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

  const parsed = contactSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  // Honeypot tripped: pretend success, drop silently.
  if (parsed.data.website) {
    return { status: "success", message: "Thanks — your message has been sent." }
  }

  const { website, ...payload } = parsed.data
  void website
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value === "" ? null : value])
  )

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert(cleanPayload as ContactMessageInsert)

  if (error) {
    console.error("[submitContactMessage]", error.message)
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again or email us directly.",
    }
  }

  return {
    status: "success",
    message: "Thanks — your message has been sent. We'll be in touch shortly.",
  }
}
