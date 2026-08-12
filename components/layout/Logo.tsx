import Image from "next/image"
import { cn } from "@/lib/utils/cn"

export function Logo({ className, height = 28 }: { className?: string; height?: number }) {
  // Source aspect ratio (mark + wordmark lockup) from brand-assets/Logo WhiteT.png
  const width = Math.round(height * (3663 / 1909))
  return (
    <Image
      src="/logo-optkor.png"
      alt="OPTKOR — Visual Production"
      width={width}
      height={height}
      priority
      className={cn("h-auto w-auto", className)}
      style={{ height, width: "auto" }}
    />
  )
}
