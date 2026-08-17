import { Container } from "@/components/ui/Container"
import { Eyebrow, Heading } from "@/components/ui/Heading"
import { Reveal } from "@/components/motion/Reveal"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import type { Testimonial } from "@/lib/supabase/types"

export function TestimonialsSection({
  dict,
  testimonials,
}: {
  dict: Dictionary
  testimonials: Testimonial[]
}) {
  if (testimonials.length === 0) return null

  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <Reveal>
          <Eyebrow>{dict.home.testimonialsEyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading as="h2" size="xl" className="mt-6 max-w-xl">
            {dict.home.testimonialsTitle}
          </Heading>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 border-t border-line pt-16 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={Math.min(index * 0.08, 0.32)} className="flex flex-col gap-6">
              <p className="font-display text-xl leading-snug text-paper md:text-2xl">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 shrink-0 bg-accent" />
                <div>
                  <p className="text-sm font-medium text-paper">{testimonial.client_name}</p>
                  {(testimonial.client_title || testimonial.client_company) && (
                    <p className="text-sm text-muted">
                      {[testimonial.client_title, testimonial.client_company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
