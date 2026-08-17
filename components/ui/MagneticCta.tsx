"use client"

import { useRef, type ReactNode } from "react"
import { motion } from "framer-motion"
import { useMagnetic } from "@/hooks/useMagnetic"

export function MagneticCta({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const magnetic = useMagnetic(ref, strength)

  return (
    <motion.div
      ref={ref}
      style={magnetic.style}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}
