import { setLocale } from "@/lib/mutations/locale"
import type { Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils/cn"

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const target: Locale = locale === "en" ? "ar" : "en"

  return (
    <form action={setLocale}>
      <input type="hidden" name="locale" value={target} />
      <button
        type="submit"
        className={cn(
          "text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        )}
        aria-label={target === "ar" ? "التبديل إلى العربية" : "Switch to English"}
      >
        {target === "ar" ? "AR" : "EN"}
      </button>
    </form>
  )
}
