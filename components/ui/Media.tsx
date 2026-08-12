"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils/cn"

type SafeImageProps = Omit<ImageProps, "onError" | "alt"> & { alt: string }

export function SafeImage({ className, alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex items-center justify-center bg-ink-3 text-muted", className)}
      >
        <span className="text-xs uppercase tracking-widest">Image unavailable</span>
      </div>
    )
  }

  return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props} />
}

export function VideoPlayer({
  src,
  className,
  poster,
}: {
  src: string
  className?: string
  poster?: string
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
      Your browser does not support embedded video.
    </video>
  )
}
