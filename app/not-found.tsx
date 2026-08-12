import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center gap-6 py-40 text-center">
      <p className="font-display text-6xl text-accent">404</p>
      <h1 className="font-display text-2xl text-paper">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button href="/" variant="secondary">
        Back to home
      </Button>
    </Container>
  )
}
