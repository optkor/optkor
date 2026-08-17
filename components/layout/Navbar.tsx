"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/ui/Container"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Logo } from "./Logo"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { useMagnetic } from "@/hooks/useMagnetic"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { Locale } from "@/lib/i18n/config"

const EASE = [0.16, 1, 0.3, 1] as const

export function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const pathname = usePathname()
  const { scrollY, scrollYProgress } = useScroll()
  const isRtl = locale === "ar"
  const magneticRef = useRef<HTMLDivElement>(null)
  const magnetic = useMagnetic(magneticRef, 0.4)

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
          <Link href="/" aria-label={dict.common.homeLabel} onClick={() => setOpen(false)} className="relative z-10">
            <Logo height={26} alt={dict.common.logoAlt} />
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
            <ThemeToggle
              className="text-paper transition-colors hover:text-accent"
              labelToDark={dict.common.switchToDark}
              labelToLight={dict.common.switchToLight}
            />
            <LanguageSwitcher locale={locale} />
            <motion.div
              ref={magneticRef}
              style={magnetic.style}
              onMouseMove={magnetic.onMouseMove}
              onMouseLeave={magnetic.onMouseLeave}
            >
              <Link
                href="/contact"
                className="border border-line-strong px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:border-accent hover:text-accent"
              >
                {dict.nav.startProject}
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle
              className="relative z-10 text-paper"
              labelToDark={dict.common.switchToDark}
              labelToLight={dict.common.switchToLight}
            />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
              className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
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
          </div>
        </Container>
        <motion.span
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent rtl:origin-right"
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: isRtl ? "circle(0% at 10% 5%)" : "circle(0% at 90% 5%)" }}
            animate={{ clipPath: isRtl ? "circle(150% at 10% 5%)" : "circle(150% at 90% 5%)" }}
            exit={{ clipPath: isRtl ? "circle(0% at 10% 5%)" : "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 top-20 z-40 bg-ink md:hidden"
          >
            <Container className="flex h-full flex-col justify-between py-10">
              <nav className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <div key={link.href} className="overflow-hidden py-1">
                    <motion.div
                      initial={{ y: "115%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "115%" }}
                      transition={{ duration: 0.6, delay: 0.1 + index * 0.06, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "font-display block py-2 text-4xl transition-colors",
                          pathname === link.href ? "text-accent" : "text-paper"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </div>
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
