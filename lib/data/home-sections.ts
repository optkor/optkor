import type { Json } from "@/lib/supabase/types"

// The reorderable/hideable sections of the home page. Hero is deliberately
// excluded -- it's the page's foundational identity, not an optional block.
export const HOME_SECTION_DEFS = [
  { key: "work", label: "Selected Work" },
  { key: "capabilities", label: "Capabilities" },
  { key: "process", label: "Process" },
  { key: "about", label: "About Teaser" },
  { key: "testimonials", label: "Testimonials" },
  { key: "cta", label: "Final CTA" },
] as const

export type HomeSectionKey = (typeof HOME_SECTION_DEFS)[number]["key"]

export type HomeSectionConfig = { key: HomeSectionKey; visible: boolean }

const VALID_KEYS = new Set(HOME_SECTION_DEFS.map((s) => s.key))
const DEFAULT_ORDER: HomeSectionConfig[] = HOME_SECTION_DEFS.map((s) => ({ key: s.key, visible: true }))

// Defensive by construction: any malformed/partial/stale config in the
// database (empty object, old key set, hand-edited JSON) falls back to the
// full default order rather than rendering a partial or broken home page.
export function resolveHomeSections(config: Json): HomeSectionConfig[] {
  if (!config || typeof config !== "object" || Array.isArray(config)) return DEFAULT_ORDER

  const sections = (config as Record<string, unknown>).sections
  if (!Array.isArray(sections) || sections.length === 0) return DEFAULT_ORDER

  const seen = new Set<string>()
  const parsed: HomeSectionConfig[] = []

  for (const entry of sections) {
    if (!entry || typeof entry !== "object") continue
    const key = (entry as Record<string, unknown>).key
    const visible = (entry as Record<string, unknown>).visible
    if (typeof key !== "string" || !VALID_KEYS.has(key as HomeSectionKey) || seen.has(key)) continue
    seen.add(key)
    parsed.push({ key: key as HomeSectionKey, visible: visible !== false })
  }

  // Any known section missing from a stale config (e.g. a new section
  // shipped after the admin last saved) is appended visible, so it never
  // silently disappears from the live site.
  for (const def of HOME_SECTION_DEFS) {
    if (!seen.has(def.key)) parsed.push({ key: def.key, visible: true })
  }

  return parsed
}
