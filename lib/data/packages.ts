/**
 * PLACEHOLDER DATA — there is no `packages` table in Supabase yet.
 *
 * This is the one piece of package content the client has actually
 * provided (tier order and monthly price). Shaped so wiring this page to
 * real dynamic data later is a one-line swap in
 * `app/(site)/packages/page.tsx` — replace the import below with a query
 * call — not a rewrite of the page or `PackageCard`.
 *
 * Tier name/positioning copy lives in the i18n dictionary (`dict.packages`)
 * rather than here, so the page is fully bilingual like the rest of the
 * site despite the data source itself being a placeholder.
 *
 * Deliberately excludes per-package included/excluded services, workflow,
 * or "best for" copy: that content has never been provided, and inventing
 * it would misrepresent the business. See the redesign report for what a
 * real `packages` table would need to make this fully dynamic.
 */
export type PackageTier = {
  slug: string
  index: number
  price: string
  cadence: string
  badge: "core" | "premium" | null
}

export const PACKAGES: PackageTier[] = [
  { slug: "creative-support", index: 1, price: "$400", cadence: "/month", badge: null },
  { slug: "brand-visual-execution", index: 2, price: "$1,000", cadence: "/month", badge: "core" },
  { slug: "visual-production-partner", index: 3, price: "$2,500", cadence: "/month", badge: "premium" },
]
