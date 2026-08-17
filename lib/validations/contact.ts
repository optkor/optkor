import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(320),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  subject: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  project_type: z.string().trim().max(120).optional().or(z.literal("")),
  budget_range: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  // Honeypot field: real users never fill this in. Bots that autofill every
  // input will, and we silently drop the submission without erroring.
  website: z.string().max(0).optional().or(z.literal("")),
})

export type ContactFormValues = z.infer<typeof contactSchema>
