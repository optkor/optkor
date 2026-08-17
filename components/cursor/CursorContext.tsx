"use client"

import { createContext, useContext } from "react"

export type CursorVariant = "default" | "link" | "view" | "explore" | "start" | "scroll"

export type CursorContextValue = {
  setCursor: (variant: CursorVariant, label?: string) => void
  resetCursor: () => void
}

const NOOP: CursorContextValue = { setCursor: () => {}, resetCursor: () => {} }

export const CursorContext = createContext<CursorContextValue | null>(null)

/** Always safe to call — returns a no-op when the cursor system isn't mounted (mobile/reduced-motion). */
export function useCursor() {
  return useContext(CursorContext) ?? NOOP
}
