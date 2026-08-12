"use client"

import { useEffect } from "react"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="flex flex-col items-center justify-center gap-6 py-40 text-center">
      <h1 className="font-display text-2xl text-paper">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} variant="secondary">
        Try again
      </Button>
    </Container>
  )
}
