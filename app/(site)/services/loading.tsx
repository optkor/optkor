import { Container } from "@/components/ui/Container"
import { LoadingState } from "@/components/ui/States"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function Loading() {
  const { dict } = await getDictionary()

  return (
    <Container className="py-24 md:py-32">
      <div className="h-4 w-32 animate-pulse bg-ink-3" />
      <div className="mt-6 h-14 w-2/3 animate-pulse bg-ink-3" />
      <LoadingState className="mt-16" label={dict.common.loading} />
    </Container>
  )
}
