import Link from "next/link"
import { getMessagesAdmin } from "@/lib/queries/messages"
import { MessagesList } from "@/components/admin/MessagesList"
import { EmptyState, ErrorState } from "@/components/ui/States"
import { cn } from "@/lib/utils/cn"
import type { MessageStatus } from "@/lib/supabase/types"

export const metadata = { title: { absolute: "Messages — OPTKOR Admin" } }

const filters: { label: string; value: MessageStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
]

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const validStatus = (["new", "read", "archived"] as const).find((s) => s === status)
  const { data, error } = await getMessagesAdmin(validStatus)
  const messages = data ?? []

  return (
    <div>
      <h1 className="font-display text-3xl text-paper">Messages</h1>

      <div className="mt-6 flex gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/messages?status=${filter.value}` : "/admin/messages"}
            className={cn(
              "border px-4 py-2 text-xs uppercase tracking-wider",
              validStatus === filter.value
                ? "border-accent text-accent"
                : "border-line-strong text-muted hover:text-paper"
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState body={error} />
        ) : messages.length === 0 ? (
          <EmptyState title="No messages" body="Submissions from the contact form will appear here." />
        ) : (
          <MessagesList messages={messages} />
        )}
      </div>
    </div>
  )
}
