import { z } from "zod"

export const siteSettingsSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(200),
  tagline: z.string().trim().max(300).optional().or(z.literal("")),
  contact_email: z.string().trim().email("Enter a valid email").max(320).optional().or(z.literal("")),
  contact_phone: z.string().trim().max(50).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  seo_title: z.string().trim().max(200).optional().or(z.literal("")),
  seo_description: z.string().trim().max(500).optional().or(z.literal("")),
  instagram_url: z.string().trim().url("Enter a valid URL").max(500).optional().or(z.literal("")),
  linkedin_url: z.string().trim().url("Enter a valid URL").max(500).optional().or(z.literal("")),
  behance_url: z.string().trim().url("Enter a valid URL").max(500).optional().or(z.literal("")),
})

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>
