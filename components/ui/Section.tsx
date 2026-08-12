import { cn } from "@/lib/utils/cn"

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div"
  border?: boolean
}

export function Section({ className, children, as = "section", border = false, ...props }: SectionProps) {
  const Tag = as
  return (
    <Tag
      className={cn(
        "py-24 md:py-32",
        border && "border-t border-line",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
