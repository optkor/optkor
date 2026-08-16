"use client"

import { useSyncExternalStore } from "react"
import { THEME_STORAGE_KEY } from "./ThemeScript"

type Theme = "light" | "dark"

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
  return () => observer.disconnect()
}
function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"
}
function getServerSnapshot(): Theme | null {
  return null
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4M15.6 15.6l-1.4-1.4M5.8 5.8 4.4 4.4"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        d="M17 11.5A7 7 0 1 1 8.5 3a5.5 5.5 0 0 0 8.5 8.5Z"
      />
    </svg>
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  // Reads the `data-theme` attribute the blocking script (ThemeScript) set
  // pre-paint, via useSyncExternalStore rather than useEffect+setState —
  // server/first-hydration render gets `null` (matching, no mismatch),
  // then syncs to the real value. A MutationObserver (not local state)
  // means every ThemeToggle instance on the page — desktop nav, mobile nav
  // — stays in sync when any one of them is clicked.
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // localStorage unavailable (private mode, etc.) — theme just won't persist
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className={className}
    >
      {theme === null ? <span className="block h-4 w-4" /> : theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
