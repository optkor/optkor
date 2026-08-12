import { cn } from "@/lib/utils/cn"

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string
  body?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-24 text-center", className)}>
      <p className="font-display text-2xl text-paper">{title}</p>
      {body && <p className="max-w-md text-sm text-muted">{body}</p>}
      {action}
    </div>
  )
}

export function ErrorState({
  title = "Something went wrong",
  body,
  action,
  className,
}: {
  title?: string
  body?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-3 py-24 text-center", className)}
    >
      <p className="font-display text-2xl text-paper">{title}</p>
      {body && <p className="max-w-md text-sm text-muted">{body}</p>}
      {action}
    </div>
  )
}

export function LoadingState({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3 py-24", className)}
    >
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
      <span className="text-xs uppercase tracking-[0.2em] text-muted">{label}</span>
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="aspect-[4/3] w-full bg-ink-3" />
      <div className="mt-4 h-3 w-2/3 bg-ink-3" />
      <div className="mt-2 h-3 w-1/3 bg-ink-3" />
    </div>
  )
}
