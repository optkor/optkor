import { z } from "zod"

export const testimonialSchema = z.object({
  quote: z.string().trim().min(1, "Quote is required").max(2000),
  client_name: z.string().trim().min(1, "Client name is required").max(200),
  client_title: z.string().trim().max(200).optional().or(z.literal("")),
  client_company: z.string().trim().max(200).optional().or(z.literal("")),
  avatar_url: z.string().trim().max(2000).optional().or(z.literal("")),
  published: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>
