"use client"

import { useRef } from "react"
import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import { Container } from "@/components/ui/Container"
import { Logo } from "./Logo"
import { useCursor } from "@/components/cursor/CursorContext"
import { gsap } from "@/lib/motion/gsap"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { SiteSettings } from "@/lib/supabase/types"

function isSocialLinks(value: unknown): value is Record<string, string | null> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function Footer({ dict, settings }: { dict: Dictionary; settings: SiteSettings }) {
  const year = new Date().getFullYear()
  const social = isSocialLinks(settings.social_links) ? settings.social_links : {}
  const socialEntries = Object.entries(social).filter(([, url]) => Boolean(url)) as [string, string][]
  const cursor = useCursor()
  const linkHover = {
    onMouseEnter: () => cursor.setCursor("link"),
    onMouseLeave: () => cursor.resetCursor(),
  }
  const openHover = {
    onMouseEnter: () => cursor.setCursor("open", dict.common.open),
    onMouseLeave: () => cursor.resetCursor(),
  }

  const shouldReduceMotion = useReducedMotion()
  const footerRef = useRef<HTMLElement>(null)
  const markRef = useRef<HTMLParagraphElement>(null)

  // The final scene: the giant wordmark wipes into view and keeps drifting
  // gently while the footer is on screen, instead of just being there.
  useGSAP(
    () => {
      if (shouldReduceMotion || !footerRef.current || !markRef.current) return
      const isRtl = getComputedStyle(document.documentElement).direction === "rtl"
      gsap.fromTo(
        markRef.current,
        { clipPath: isRtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: { trigger: markRef.current, start: "top 95%", end: "top 55%", scrub: 0.5 },
        }
      )
      gsap.fromTo(
        markRef.current,
        { xPercent: -3 },
        {
          xPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: footerRef.current, start: "top bottom", end: "bottom bottom", scrub: true },
        }
      )
    },
    { scope: footerRef, dependencies: [shouldReduceMotion] }
  )

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-line">
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
            <Link href="/work" {...linkHover} className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.work}
            </Link>
            <Link href="/services" {...linkHover} className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.services}
            </Link>
            <Link href="/packages" {...linkHover} className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.packages}
            </Link>
            <Link href="/about" {...linkHover} className="w-fit text-sm text-paper transition-colors hover:text-accent">
              {dict.nav.about}
            </Link>
            <Link href="/contact" {...linkHover} className="w-fit text-sm text-paper transition-colors hover:text-accent">
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
                {...openHover}
                className="w-fit text-sm text-paper transition-colors hover:text-accent"
              >
                {settings.contact_email}
              </a>
            )}
            {settings.contact_phone && (
              <a
                href={`tel:${settings.contact_phone}`}
                {...openHover}
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
                {...openHover}
                className="w-fit text-sm capitalize text-paper transition-colors hover:text-accent"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="overflow-hidden border-t border-line py-8 md:py-12">
        <Container>
          <p
            ref={markRef}
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
