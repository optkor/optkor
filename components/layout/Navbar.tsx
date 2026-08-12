"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/ui/Container"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Logo } from "./Logo"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { Locale } from "@/lib/i18n/config"

export function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: "/work", label: dict.nav.work },
    { href: "/services", label: dict.nav.services },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" aria-label="OPTKOR — home" onClick={() => setOpen(false)}>
          <Logo height={26} />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-accent",
                pathname === link.href ? "text-accent" : "text-paper"
              )}
            >
              {link.label}
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
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={cn(
              "h-px w-6 bg-paper transition-transform",
              open && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-px w-6 bg-paper transition-transform",
              open && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <Container className="flex flex-col gap-6 py-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl text-paper"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4">
                <LanguageSwitcher locale={locale} />
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="border border-line-strong px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-accent"
                >
                  {dict.nav.startProject}
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
