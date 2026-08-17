import { setLocale } from "@/lib/mutations/locale"
import type { Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils/cn"

/**
 * Two explicit, always-visible choices rather than a single toggle that
 * shows only the "other" language — clicking EN always means English and
 * clicking AR always means Arabic, so there's nothing to guess. The active
 * language is marked both visually (accent color) and via aria-current for
 * screen readers.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <form action={setLocale} className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
      <button
        type="submit"
        name="locale"
        value="en"
        aria-current={locale === "en" ? "true" : undefined}
        aria-label="Switch to English"
        disabled={locale === "en"}
        className={cn(
          "transition-colors",
          locale === "en" ? "text-accent" : "text-muted hover:text-accent"
        )}
      >
        EN
      </button>
      <span aria-hidden className="text-line-strong">
        /
      </span>
      <button
        type="submit"
        name="locale"
        value="ar"
        aria-current={locale === "ar" ? "true" : undefined}
        aria-label="التبديل إلى العربية"
        disabled={locale === "ar"}
        style={{ fontFamily: "var(--font-cairo), var(--font-inter), Tahoma, sans-serif" }}
        className={cn(
          "normal-case tracking-normal transition-colors",
          locale === "ar" ? "text-accent" : "text-muted hover:text-accent"
        )}
      >
        العربية
      </button>
    </form>
  )
}
