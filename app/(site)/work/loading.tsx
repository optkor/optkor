import { Container } from "@/components/ui/Container"
import { CardSkeleton } from "@/components/ui/States"

export default function Loading() {
  return (
    <Container className="py-24 md:py-32">
      <div className="h-4 w-32 animate-pulse bg-ink-3" />
      <div className="mt-6 h-14 w-2/3 animate-pulse bg-ink-3" />
      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </Container>
  )
}
