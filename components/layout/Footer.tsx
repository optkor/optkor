import Link from "next/link"
import { Container } from "@/components/ui/Container"
import { Logo } from "./Logo"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { SiteSettings } from "@/lib/supabase/types"

function isSocialLinks(value: unknown): value is Record<string, string | null> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function Footer({ dict, settings }: { dict: Dictionary; settings: SiteSettings }) {
  const year = new Date().getFullYear()
  const social = isSocialLinks(settings.social_links) ? settings.social_links : {}
  const socialEntries = Object.entries(social).filter(([, url]) => Boolean(url)) as [string, string][]

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />
      <Container className="relative grid grid-cols-1 gap-12 py-20 md:grid-cols-[1.4fr_1fr_1fr] md:py-24">
        <div>
          <Logo height={26} />
          <p className="font-display mt-6 max-w-xs text-xl leading-snug text-paper-dim">
            {settings.tagline ?? dict.footer.tagline}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {dict.footer.navigation}
          </p>
          <nav className="mt-5 flex flex-col gap-3">
            <Link href="/work" className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.work}
            </Link>
            <Link href="/services" className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.services}
            </Link>
            <Link href="/packages" className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.packages}
            </Link>
            <Link href="/about" className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.about}
            </Link>
            <Link href="/contact" className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.contact}
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {dict.footer.connect}
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="w-fit text-sm text-paper transition-colors hover:text-accent"
              >
                {settings.contact_email}
              </a>
            )}
            {settings.contact_phone && (
              <a
                href={`tel:${settings.contact_phone}`}
                className="w-fit text-sm text-paper transition-colors hover:text-accent"
              >
                {settings.contact_phone}
              </a>
            )}
            {socialEntries.map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-sm capitalize text-paper transition-colors hover:text-accent"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-line py-8 md:py-12">
        <Container>
          <p
            aria-hidden
            className="font-display select-none text-center text-[clamp(3rem,14vw,11rem)] leading-none tracking-tight text-paper-dim/10"
          >
            {settings.company_name}
          </p>
        </Container>
      </div>

      <Container className="flex flex-col items-center justify-between gap-2 border-t border-line py-6 text-xs text-muted md:flex-row">
        <p>
          © {year} {settings.company_name}. {dict.footer.rights}
        </p>
      </Container>
    </footer>
  )
}
