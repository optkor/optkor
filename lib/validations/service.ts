import { z } from "zod"

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().max(20000).optional().or(z.literal("")),
  short_description: z.string().trim().max(500).optional().or(z.literal("")),
  icon: z.string().trim().max(120).optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>
