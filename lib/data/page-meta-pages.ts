// Curated list of top-level routes the admin can override SEO/OG metadata
// for. Dynamic detail routes (project/package slugs) already derive their
// title/description from the item's own content and are intentionally left
// out of this fixed list.
export const PAGE_META_PAGES = [
  { path: "/", slug: "home", label: "Home" },
  { path: "/work", slug: "work", label: "Work" },
  { path: "/services", slug: "services", label: "Services" },
  { path: "/packages", slug: "packages", label: "Packages" },
  { path: "/about", slug: "about", label: "About" },
  { path: "/contact", slug: "contact", label: "Contact" },
] as const
