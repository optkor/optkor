import { Container } from "@/components/ui/Container"

export default function Loading() {
  return (
    <Container className="py-24 md:py-32">
      <div className="h-4 w-40 animate-pulse bg-ink-3" />
      <div className="mt-6 h-20 w-3/4 animate-pulse bg-ink-3" />
      <div className="mt-16 aspect-[16/9] w-full animate-pulse bg-ink-3" />
    </Container>
  )
}
