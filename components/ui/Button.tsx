import Link from "next/link"
import { cn } from "@/lib/utils/cn"

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-40 disabled:pointer-events-none"

const variants: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary: "bg-accent text-ink hover:bg-accent-soft",
  secondary: "border border-line-strong text-paper hover:border-accent hover:text-accent",
  ghost: "text-paper hover:text-accent",
}

const sizes: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-sm px-8 py-4",
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <Link href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
