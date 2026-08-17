"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils/cn"

type SafeImageProps = Omit<ImageProps, "onError" | "alt"> & { alt: string; unavailableLabel?: string }

/**
 * next/image throws synchronously (a page-crashing render error, not a
 * catchable `onError`) for any src whose host isn't in next.config.ts's
 * `images.remotePatterns` — e.g. a project cover image pasted from a
 * non-Supabase URL via the admin. Pre-validate here so that case degrades
 * to the same "Image unavailable" fallback as a normal load failure,
 * instead of taking down the whole page.
 */
function isAllowedImageSrc(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return true // StaticImageData import — always safe
  if (src.startsWith("/")) return true // local /public asset
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return false
  try {
    return new URL(src).hostname === new URL(supabaseUrl).hostname
  } catch {
    return false
  }
}

export function SafeImage({
  className,
  alt,
  src,
  unavailableLabel = "Image unavailable",
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !isAllowedImageSrc(src)) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex items-center justify-center bg-ink-3 text-muted", className)}
      >
        <span className="text-xs uppercase tracking-widest">{unavailableLabel}</span>
      </div>
    )
  }

  return <Image alt={alt} src={src} className={className} onError={() => setFailed(true)} {...props} />
}

export function VideoPlayer({
  src,
  className,
  poster,
  fallbackLabel = "Your browser does not support embedded video.",
}: {
  src: string
  className?: string
  poster?: string
  fallbackLabel?: string
}) {
  return (
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className={cn("h-full w-full bg-ink-3 object-cover", className)}
    >
      {fallbackLabel}
    </video>
  )
}
