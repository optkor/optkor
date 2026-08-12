"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { cn } from "@/lib/utils/cn"

type ToastTone = "success" | "error"
type ToastItem = { id: number; message: string; tone: ToastTone }

type ToastContextValue = {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, message, tone }])
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto min-w-[240px] max-w-sm border px-4 py-3 text-sm shadow-lg animate-fade-up",
              item.tone === "success"
                ? "border-success/40 bg-ink-2 text-paper"
                : "border-danger/40 bg-ink-2 text-paper"
            )}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
