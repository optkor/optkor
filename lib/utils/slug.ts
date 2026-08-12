const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const COMBINING_DIACRITICS = /[̀-ͯ]/g

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug)
}
