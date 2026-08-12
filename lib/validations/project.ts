import { z } from "zod"

const slugField = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120, "Slug is too long")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only")

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugField,
  client: z.string().trim().max(200).optional().or(z.literal("")),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().max(20000).optional().or(z.literal("")),
  short_description: z.string().trim().max(500).optional().or(z.literal("")),
  year: z.coerce.number().int().min(1990).max(2100).optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  cover_image: z.string().trim().max(2000).optional().or(z.literal("")),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export const projectMediaSchema = z.object({
  project_id: z.string().uuid(),
  type: z.enum(["image", "video"]),
  url: z.string().trim().min(1).max(2000),
  alt: z.string().trim().max(500).optional().or(z.literal("")),
  caption: z.string().trim().max(1000).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().default(0),
})

export type ProjectMediaFormValues = z.infer<typeof projectMediaSchema>
