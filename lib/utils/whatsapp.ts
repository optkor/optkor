/**
 * Builds a wa.me link from the site's configured contact phone number.
 * Returns null when the number doesn't have enough digits to plausibly be
 * a real phone number, so callers can skip rendering the link entirely
 * instead of producing a broken `https://wa.me/` href.
 */
export function getWhatsAppHref(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 8) return null
  return `https://wa.me/${digits}`
}
