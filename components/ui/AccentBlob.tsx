import { cn } from "@/lib/utils/cn"

/**
 * Abstract petal/flare shape echoing the brand's corner-accent graphic
 * (seen across the LinkedIn cover, profile, and story templates).
 * Decorative only — not the logo mark itself.
 */
export function AccentBlob({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M400 0 C 320 40, 260 110, 240 200 C 220 290, 260 350, 340 400 L400 400 Z"
        fill="currentColor"
      />
    </svg>
  )
}
