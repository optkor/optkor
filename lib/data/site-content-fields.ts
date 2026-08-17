// Curated list of dictionary leaf keys the admin is allowed to override via
// the site_content table. Deliberately a fixed allowlist (not "any key") so
// an override can never touch a string the dictionary doesn't actually have.
export type SiteContentFieldType = "input" | "textarea"

export type SiteContentField = {
  section: string
  key: string
  label: string
  type: SiteContentFieldType
}

export const SITE_CONTENT_FIELDS: SiteContentField[] = [
  { section: "home", key: "heroEyebrow", label: "Hero — Eyebrow", type: "input" },
  { section: "home", key: "heroTitle", label: "Hero — Headline", type: "input" },
  { section: "home", key: "heroSubtitle", label: "Hero — Subtitle", type: "textarea" },
  { section: "home", key: "heroCtaPrimary", label: "Hero — Primary Button", type: "input" },
  { section: "home", key: "heroCtaSecondary", label: "Hero — Secondary Button", type: "input" },
  { section: "home", key: "workTitle", label: "Work Section — Title", type: "input" },
  { section: "home", key: "capabilitiesTitle", label: "Capabilities — Title", type: "input" },
  { section: "home", key: "processTitle", label: "Process — Title", type: "input" },
  { section: "home", key: "aboutTitle", label: "About Teaser — Title", type: "input" },
  { section: "home", key: "aboutBody", label: "About Teaser — Body", type: "textarea" },
  { section: "home", key: "ctaTitle", label: "Final CTA — Title", type: "input" },
  { section: "home", key: "ctaBody", label: "Final CTA — Body", type: "textarea" },
  { section: "nav", key: "startProject", label: "Nav — Start a Project Label", type: "input" },
  { section: "footer", key: "tagline", label: "Footer — Tagline", type: "input" },
  { section: "about", key: "title", label: "About Page — Title", type: "input" },
  { section: "about", key: "body1", label: "About Page — Body 1", type: "textarea" },
  { section: "about", key: "body2", label: "About Page — Body 2", type: "textarea" },
  { section: "about", key: "body3", label: "About Page — Body 3", type: "textarea" },
  { section: "about", key: "valuesTitle", label: "About Page — Values Heading", type: "input" },
  { section: "contact", key: "title", label: "Contact Page — Title", type: "input" },
  { section: "contact", key: "subtitle", label: "Contact Page — Subtitle", type: "textarea" },
]
