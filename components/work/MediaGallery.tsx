import { SafeImage, VideoPlayer } from "@/components/ui/Media"
import { Reveal } from "@/components/motion/Reveal"
import { FrameMark } from "@/components/motion/FrameMark"
import type { ProjectMedia } from "@/lib/supabase/types"

const ASPECTS = ["aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[4/3]"]

export function MediaGallery({ media }: { media: ProjectMedia[] }) {
  if (media.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((item, index) => {
        const wide = index % 5 === 0
        const aspect = item.type === "video" ? "aspect-video" : ASPECTS[index % ASPECTS.length]

        return (
          <Reveal
            key={item.id}
            delay={Math.min(index * 0.05, 0.3)}
            className={wide ? "sm:col-span-2" : undefined}
          >
            <figure className="relative overflow-hidden bg-ink-3">
              <FrameMark />
              {item.type === "video" ? (
                <VideoPlayer src={item.url} className={aspect} />
              ) : (
                <div className={`relative w-full ${aspect}`}>
                  <SafeImage
                    src={item.url}
                    alt={item.alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              {item.caption && <figcaption className="p-3 text-xs text-muted">{item.caption}</figcaption>}
            </figure>
          </Reveal>
        )
      })}
    </div>
  )
}
