"use client"

import { useState, useTransition } from "react"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { useToast } from "@/components/ui/Toast"
import { deleteMessage, setMessageStatus } from "@/lib/mutations/messages"
import { formatDateTime } from "@/lib/utils/format"
import type { ContactMessage, MessageStatus } from "@/lib/supabase/types"

const toneFor: Record<MessageStatus, "accent" | "muted" | "success"> = {
  new: "accent",
  read: "muted",
  archived: "muted",
}

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [openId, setOpenId] = useState<string | null>(null)

  function handleOpen(message: ContactMessage) {
    const next = openId === message.id ? null : message.id
    setOpenId(next)
    if (next && message.status === "new") {
      startTransition(async () => {
        await setMessageStatus(message.id, "read")
      })
    }
  }

  function handleStatus(id: string, status: MessageStatus) {
    startTransition(async () => {
      const result = await setMessageStatus(id, status)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteMessage(id)
      toast(result.message, result.status === "error" ? "error" : "success")
      if (openId === id) setOpenId(null)
    })
  }

  return (
    <div className="flex flex-col divide-y divide-line border border-line">
      {messages.map((message) => {
        const open = openId === message.id
        return (
          <div key={message.id}>
            <button
              type="button"
              onClick={() => handleOpen(message)}
              className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 text-left hover:bg-ink-2"
            >
              <div className="flex min-w-0 items-center gap-3">
                <StatusBadge tone={toneFor[message.status as MessageStatus]}>{message.status}</StatusBadge>
                <span className="truncate font-medium text-paper">{message.name}</span>
                <span className="truncate text-sm text-muted">{message.email}</span>
              </div>
              <span className="text-xs text-muted">{formatDateTime(message.created_at)}</span>
            </button>

            {open && (
              <div className="border-t border-line bg-ink-2 px-4 py-5">
                <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  {message.company && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Company</dt>
                      <dd className="text-paper">{message.company}</dd>
                    </div>
                  )}
                  {message.phone && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Phone</dt>
                      <dd className="text-paper">{message.phone}</dd>
                    </div>
                  )}
                  {message.subject && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Subject</dt>
                      <dd className="text-paper">{message.subject}</dd>
                    </div>
                  )}
                  {message.project_type && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Project Type</dt>
                      <dd className="text-paper">{message.project_type}</dd>
                    </div>
                  )}
                  {message.budget_range && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Budget</dt>
                      <dd className="text-paper">{message.budget_range}</dd>
                    </div>
                  )}
                  {message.timeline && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted">Timeline</dt>
                      <dd className="text-paper">{message.timeline}</dd>
                    </div>
                  )}
                </dl>

                <p className="mt-4 whitespace-pre-line text-sm text-paper-dim">{message.message}</p>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-4">
                  <a
                    href={`mailto:${message.email}`}
                    className="text-xs uppercase tracking-wider text-accent hover:underline"
                  >
                    Reply by email
                  </a>
                  {message.status !== "archived" ? (
                    <button
                      disabled={pending}
                      onClick={() => handleStatus(message.id, "archived")}
                      className="text-xs uppercase tracking-wider text-muted hover:text-paper disabled:opacity-50"
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      disabled={pending}
                      onClick={() => handleStatus(message.id, "read")}
                      className="text-xs uppercase tracking-wider text-muted hover:text-paper disabled:opacity-50"
                    >
                      Unarchive
                    </button>
                  )}
                  <button
                    disabled={pending}
                    onClick={() => handleDelete(message.id)}
                    className="text-xs uppercase tracking-wider text-danger hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
