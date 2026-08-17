import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function NotFound() {
  const { dict } = await getDictionary()

  return (
    <Container className="flex flex-col items-center justify-center gap-6 py-40 text-center">
      <p className="font-display text-6xl text-accent">404</p>
      <h1 className="font-display text-2xl text-paper">{dict.common.pageNotFoundTitle}</h1>
      <p className="max-w-sm text-sm text-muted">{dict.common.pageNotFoundBody}</p>
      <Button href="/" variant="secondary">
        {dict.common.backToHome}
      </Button>
    </Container>
  )
}
