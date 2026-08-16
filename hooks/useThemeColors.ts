"use client"

import { useSyncExternalStore } from "react"

export type ThemeColors = { bg: string; fg: string; accent: string }

const DARK_DEFAULT: ThemeColors = { bg: "#030812", fg: "#fbf9e4", accent: "#0a84ff" }

// useSyncExternalStore compares snapshots by reference — a fresh object
// literal on every call looks like a change on every render and causes an
// infinite update loop ("Maximum update depth exceeded"). Cache and only
// allocate a new object when a value actually changed.
let cached: ThemeColors = DARK_DEFAULT

function readColors(): ThemeColors {
  const style = getComputedStyle(document.documentElement)
  const bg = style.getPropertyValue("--bg").trim()
  const fg = style.getPropertyValue("--fg").trim()
  const accent = style.getPropertyValue("--accent").trim()
  if (!bg || !fg || !accent) return cached
  if (cached.bg === bg && cached.fg === fg && cached.accent === accent) return cached
  cached = { bg, fg, accent }
  return cached
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
  return () => observer.disconnect()
}

/** Live-reads the active theme's brand colors (see app/globals.css tokens) for anything — e.g. WebGL uniforms — that can't just consume the CSS variables directly. */
export function useThemeColors(): ThemeColors {
  return useSyncExternalStore(subscribe, readColors, () => DARK_DEFAULT)
}
