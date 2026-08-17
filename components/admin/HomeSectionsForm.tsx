"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { updateHomeSections } from "@/lib/mutations/settings"
import { HOME_SECTION_DEFS, type HomeSectionConfig } from "@/lib/data/home-sections"
import type { MutationState } from "@/lib/mutations/projects"

const initialState: MutationState = { status: "idle", message: "" }
const LABELS = new Map(HOME_SECTION_DEFS.map((s) => [s.key, s.label]))

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Section Order"}
    </button>
  )
}

export function HomeSectionsForm({ initial }: { initial: HomeSectionConfig[] }) {
  const [state, formAction] = useActionState(updateHomeSections, initialState)
  const [order, setOrder] = useState(initial)

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function toggleVisible(index: number) {
    setOrder((prev) => prev.map((s, i) => (i === index ? { ...s, visible: !s.visible } : s)))
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="home_sections" value={JSON.stringify(order)} />

      <ul className="flex flex-col gap-2 border-t border-line pt-4">
        {order.map((section, index) => (
          <li
            key={section.key}
            className="flex items-center justify-between gap-4 border-b border-line py-3"
          >
            <div className="flex items-center gap-4">
              <span className="font-display text-sm text-muted">{String(index + 1).padStart(2, "0")}</span>
              <span className={section.visible ? "text-paper" : "text-muted line-through"}>
                {LABELS.get(section.key)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
                <input
                  type="checkbox"
                  checked={section.visible}
                  onChange={() => toggleVisible(index)}
                  className="accent-accent"
                />
                Visible
              </label>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${LABELS.get(section.key)} up`}
                className="px-2 py-1 text-sm text-paper hover:text-accent disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === order.length - 1}
                aria-label={`Move ${LABELS.get(section.key)} down`}
                className="px-2 py-1 text-sm text-paper hover:text-accent disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p role="status" className="text-sm text-success">
          {state.message}
        </p>
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  )
}
