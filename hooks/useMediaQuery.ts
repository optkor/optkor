"use client"

import { useSyncExternalStore } from "react"

function subscribe(query: string, callback: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

/**
 * Reads a media query via useSyncExternalStore rather than
 * useEffect+setState — avoids both the extra cascading render and any
 * server/client mismatch (getServerSnapshot always reports no-match, since
 * the server has no viewport/input-device to query).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => window.matchMedia(query).matches,
    () => false
  )
}
