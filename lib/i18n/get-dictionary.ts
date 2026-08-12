import "server-only"
import { cookies } from "next/headers"
import { defaultLocale, isLocale, localeCookieName, type Locale } from "./config"
import en from "./dictionaries/en"
import ar from "./dictionaries/ar"

const dictionaries = { en, ar }

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(localeCookieName)?.value
  return isLocale(value) ? value : defaultLocale
}

export async function getDictionary() {
  const locale = await getLocale()
  return { locale, dict: dictionaries[locale] }
}
