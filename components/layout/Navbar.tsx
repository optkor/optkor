"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/ui/Container"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Logo } from "./Logo"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { Locale } from "@/lib/i18n/config"

const EASE = [0.16, 1, 0.3, 1] as const

export function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? current
    setScrolled(current > 24)
    if (open) {
      setHidden(false)
      return
    }
    setHidden(current > previous && current > 160)
  })

  const links = [
    { href: "/work", label: dict.nav.work },
    { href: "/services", label: dict.nav.services },
    { href: "/packages", label: dict.nav.packages },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ]

  return (
    <>
      {/*
        The mobile panel below is intentionally a SIBLING of this header, not
        a child. This header animates via `transform` (hide-on-scroll), and a
        transformed ancestor becomes the containing block for any
        `position: fixed` descendant per the CSS spec — nesting the fixed
        full-screen panel inside it collapsed the panel to zero height
        (resolved against the header's own ~80px box instead of the
        viewport). Keeping it outside avoids that trap entirely.
      */}
      <motion.header
        style={{ viewTransitionName: "site-header" }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.4, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
          scrolled || open
            ? "border-line bg-ink/90 backdrop-blur"
            : "border-transparent bg-transparent"
        )}
      >
        <Container className="flex h-20 items-center justify-between">
          <Link href="/" aria-label="OPTKOR — home" onClick={() => setOpen(false)} className="relative z-10">
            <Logo height={26} />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-accent",
                  pathname === link.href ? "text-accent" : "text-paper"
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 rtl:origin-right",
                    pathname === link.href && "scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <LanguageSwitcher locale={locale} />
            <Link
              href="/contact"
              className="border border-line-strong px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:border-accent hover:text-accent"
            >
              {dict.nav.startProject}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={cn(
                "h-px w-6 bg-paper transition-transform duration-300",
                open && "translate-y-[3.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-paper transition-transform duration-300",
                open && "-translate-y-[3.5px] -rotate-45"
              )}
            />
          </button>
        </Container>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-20 z-40 bg-ink md:hidden"
          >
            <Container className="flex h-full flex-col justify-between py-10">
              <nav className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 + index * 0.06, ease: EASE }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "font-display block py-3 text-4xl transition-colors",
                        pathname === link.href ? "text-accent" : "text-paper"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
                className="flex items-center justify-between border-t border-line pt-6"
              >
                <LanguageSwitcher locale={locale} />
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="border border-line-strong px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-accent"
                >
                  {dict.nav.startProject}
                </Link>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
