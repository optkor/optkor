import { z } from "zod"

export const faqSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(300),
  answer: z.string().trim().min(1, "Answer is required").max(5000),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  published: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
})

export type FaqFormValues = z.infer<typeof faqSchema>
