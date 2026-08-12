"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { signOut } from "@/lib/mutations/auth"

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
]

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-b border-line bg-ink-2 p-6 md:h-screen md:w-64 md:border-b-0 md:border-r md:sticky md:top-0">
      <div>
        <Link href="/admin" className="font-display text-lg text-paper">
          OPTKOR <span className="text-accent">Admin</span>
        </Link>

        <nav className="mt-10 flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {links.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-ink text-accent" : "text-muted hover:text-paper"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6">
        {email && <p className="truncate text-xs text-muted">{email}</p>}
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs font-medium uppercase tracking-wider text-muted hover:text-accent"
          >
            Sign out
          </button>
        </form>
        <Link href="/" className="text-xs text-muted hover:text-accent">
          ← Back to site
        </Link>
      </div>
    </aside>
  )
}
