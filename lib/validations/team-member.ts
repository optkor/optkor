import { z } from "zod"

export const teamMemberSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  role: z.string().trim().min(1, "Role is required").max(200),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  photo_url: z.string().trim().max(2000).optional().or(z.literal("")),
  linkedin_url: z.string().trim().max(500).optional().or(z.literal("")),
  instagram_url: z.string().trim().max(500).optional().or(z.literal("")),
  published: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
})

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>
