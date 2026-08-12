export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const

export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const

export const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB, matches the storage bucket limit

export type MediaValidationResult = { valid: true } | { valid: false; error: string }

export function validateMediaFile(file: File): MediaValidationResult {
  if (!ALLOWED_MEDIA_TYPES.includes(file.type as (typeof ALLOWED_MEDIA_TYPES)[number])) {
    return { valid: false, error: `Unsupported file type: ${file.type || "unknown"}` }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "File exceeds the 50MB size limit" }
  }
  if (file.size === 0) {
    return { valid: false, error: "File is empty" }
  }
  return { valid: true }
}

export function mediaTypeFromMime(mime: string): "image" | "video" {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(mime) ? "image" : "video"
}
