import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import { FrameMark } from "@/components/motion/FrameMark"
import { SafeImage } from "@/components/ui/Media"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { TeamMember } from "@/lib/supabase/types"

function isSocialLinks(value: unknown): value is Record<string, string | null> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function TeamSection({ dict, members }: { dict: Dictionary; members: TeamMember[] }) {
  if (members.length === 0) return null

  return (
    <section className="border-t border-line py-24">
      <Container>
        <Reveal>
          <Eyebrow>{dict.about.teamEyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h2" size="lg" className="mt-6 max-w-xl">
            {dict.about.teamTitle}
          </Heading>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => {
            const social = isSocialLinks(member.social_links) ? member.social_links : {}
            const socialEntries = Object.entries(social).filter(([, url]) => Boolean(url)) as [string, string][]

            return (
              <Reveal key={member.id} delay={Math.min(index * 0.06, 0.3)} className="flex flex-col gap-4">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-3">
                  <FrameMark />
                  {member.photo_url ? (
                    <SafeImage
                      src={member.photo_url}
                      alt={member.name}
                      width={400}
                      height={500}
                      className="h-full w-full object-cover"
                      unavailableLabel={dict.common.imageUnavailable}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-4xl text-line-strong">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-display text-xl text-paper">{member.name}</p>
                  <p className="mt-1 text-sm text-muted">{member.role}</p>
                  {member.bio && <p className="mt-3 text-sm leading-relaxed text-paper-dim">{member.bio}</p>}
                  {socialEntries.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                      {socialEntries.map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs uppercase tracking-wider text-accent hover:underline"
                        >
                          {platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
