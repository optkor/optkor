/**
 * Decorative, purely CSS-driven capability strip. aria-hidden because the
 * same list is already presented accessibly in the Capabilities section —
 * this is reinforcement, not the source of the information.
 */
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-12">
            <span className="font-display text-base text-paper-dim md:text-lg">{item}</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  )
}
