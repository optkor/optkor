import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { defaultLocale, isLocale, localeCookieName, type Locale } from "./config"
import en, { type Dictionary } from "./dictionaries/en"
import ar from "./dictionaries/ar"
import { getSiteContentOverrides } from "@/lib/queries/site-content"

const dictionaries = { en, ar }

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(localeCookieName)?.value
  return isLocale(value) ? value : defaultLocale
}

// Admin-authored overrides only ever replace an existing dictionary leaf
// string (the section/key must already exist) — this can never introduce a
// key the rest of the app doesn't already render, and only the sections that
// actually have an override get shallow-copied off the shared module-level
// dictionary singleton.
function applyOverrides(dict: Dictionary, overrides: { section: string; key: string; value: string }[]): Dictionary {
  if (overrides.length === 0) return dict
  const next = { ...dict } as Record<string, unknown>

  for (const { section, key, value } of overrides) {
    const original = (dict as Record<string, unknown>)[section]
    if (!original || typeof original !== "object" || !(key in original)) continue
    if (next[section] === original) {
      next[section] = { ...(original as Record<string, unknown>) }
    }
    ;(next[section] as Record<string, unknown>)[key] = value
  }

  return next as Dictionary
}

// cache() dedupes this per request — RootLayout, the (site) layout, and
// every page all call getDictionary(), and without memoization that would
// mean one Supabase round trip for overrides per call instead of one total.
export const getDictionary = cache(async () => {
  const locale = await getLocale()
  const { data: overrides } = await getSiteContentOverrides(locale)
  const dict = applyOverrides(dictionaries[locale], overrides ?? [])
  return { locale, dict }
})
