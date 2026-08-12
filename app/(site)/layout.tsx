import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getSiteSettings } from "@/lib/queries/settings"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { dict, locale } = await getDictionary()
  const { data: settings } = await getSiteSettings()

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar dict={dict} locale={locale} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer dict={dict} settings={settings} />
    </>
  )
}
