"use client"

import { useRef, type ReactNode } from "react"
import { motion } from "framer-motion"
import { useMagnetic } from "@/hooks/useMagnetic"
import { useCursor, type CursorVariant } from "@/components/cursor/CursorContext"

export function MagneticCta({
  children,
  strength = 0.3,
  cursorVariant = "start",
  cursorLabel,
  className,
}: {
  children: ReactNode
  strength?: number
  cursorVariant?: CursorVariant
  cursorLabel?: string
  className?: string
}) {
  const cursor = useCursor()
  const ref = useRef<HTMLDivElement>(null)
  const magnetic = useMagnetic(ref, strength)

  return (
    <motion.div
      ref={ref}
      style={magnetic.style}
      onMouseMove={magnetic.onMouseMove}
      onMouseEnter={() => cursor.setCursor(cursorVariant, cursorLabel)}
      onMouseLeave={() => {
        magnetic.onMouseLeave?.()
        cursor.resetCursor()
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
