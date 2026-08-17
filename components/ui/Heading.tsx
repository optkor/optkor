import { cn } from "@/lib/utils/cn"

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4"
  size?: "display" | "xl" | "lg" | "md" | "sm"
}

const sizes: Record<NonNullable<HeadingProps["size"]>, string> = {
  display: "text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.98] tracking-tight",
  xl: "text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight",
  lg: "text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.05] tracking-tight",
  md: "text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.15]",
  sm: "text-lg md:text-xl leading-[1.2]",
}

export function Heading({ as = "h2", size = "lg", className, children, ...props }: HeadingProps) {
  const Tag = as
  return (
    <Tag className={cn("font-display font-normal text-paper", sizes[size], className)} {...props}>
      {children}
    </Tag>
  )
}

/**
 * OPTKOR's slate/tag treatment for section labels — bracketed like a shot
 * label or frame index instead of the generic "rule + caps" eyebrow
 * pattern. One shared component, so every page picks this up automatically.
 */
export function Eyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.35em] font-sans text-xs font-semibold uppercase tracking-[0.3em] text-accent",
        className
      )}
      {...props}
    >
      <span aria-hidden className="text-accent/45">
        [
      </span>
      {children}
      <span aria-hidden className="text-accent/45">
        ]
      </span>
    </span>
  )
}
