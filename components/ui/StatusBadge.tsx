import { cn } from "@/lib/utils/cn"

type Tone = "accent" | "muted" | "success" | "danger"

const tones: Record<Tone, string> = {
  accent: "border-accent/40 text-accent",
  muted: "border-line-strong text-muted",
  success: "border-success/40 text-success",
  danger: "border-danger/40 text-danger",
}

export function StatusBadge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
