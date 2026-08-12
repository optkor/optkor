import { SafeImage, VideoPlayer } from "@/components/ui/Media"
import type { ProjectMedia } from "@/lib/supabase/types"

export function MediaGallery({ media }: { media: ProjectMedia[] }) {
  if (media.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {media.map((item) => (
        <figure key={item.id} className="relative overflow-hidden bg-ink-3">
          {item.type === "video" ? (
            <VideoPlayer src={item.url} className="aspect-video" />
          ) : (
            <div className="relative aspect-[4/3] w-full">
              <SafeImage
                src={item.url}
                alt={item.alt ?? ""}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {item.caption && (
            <figcaption className="p-3 text-xs text-muted">{item.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
