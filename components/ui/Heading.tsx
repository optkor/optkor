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

export function Eyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-accent",
        className
      )}
      {...props}
    >
      <span aria-hidden className="h-px w-8 bg-accent" />
      {children}
    </span>
  )
}
