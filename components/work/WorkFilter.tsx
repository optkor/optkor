"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils/cn"

export function WorkFilter({ categories, allLabel }: { categories: string[]; allLabel: string }) {
  const searchParams = useSearchParams()
  const active = searchParams.get("category")

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/work"
        className={cn(
          "border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
          !active ? "border-accent text-accent" : "border-line-strong text-muted hover:border-accent/50 hover:text-accent"
        )}
      >
        {allLabel}
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/work?category=${encodeURIComponent(category)}`}
          className={cn(
            "border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
            active === category
              ? "border-accent text-accent"
              : "border-line-strong text-muted hover:border-accent/50 hover:text-accent"
          )}
        >
          {category}
        </Link>
      ))}
    </div>
  )
}
