"use client"

import { useEffect, useState } from "react"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import en from "@/lib/i18n/dictionaries/en"
import ar from "@/lib/i18n/dictionaries/ar"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [dict] = useState(() => (typeof document !== "undefined" && document.documentElement.lang === "ar" ? ar : en))

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="flex flex-col items-center justify-center gap-6 py-40 text-center">
      <h1 className="font-display text-2xl text-paper">{dict.common.somethingWrong}</h1>
      <Button onClick={reset} variant="secondary">
        {dict.common.retry}
      </Button>
    </Container>
  )
}
