import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { ContactMessage, MessageStatus } from "@/lib/supabase/types"
import type { QueryResult } from "./projects"

export async function getMessagesAdmin(status?: MessageStatus): Promise<QueryResult<ContactMessage[]>> {
  const supabase = await createClient()
  let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("[getMessagesAdmin]", error.message)
    return { data: null, error: "Unable to load messages." }
  }

  return { data: data ?? [], error: null }
}

export async function getMessageByIdAdmin(id: string): Promise<QueryResult<ContactMessage | null>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("contact_messages").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("[getMessageByIdAdmin]", error.message)
    return { data: null, error: "Unable to load this message." }
  }

  return { data, error: null }
}

export async function getMessageCountsAdmin(): Promise<
  QueryResult<{ total: number; new: number; read: number; archived: number }>
> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("contact_messages").select("status")

  if (error) {
    console.error("[getMessageCountsAdmin]", error.message)
    return { data: null, error: "Unable to load message counts." }
  }

  const rows = data ?? []
  return {
    data: {
      total: rows.length,
      new: rows.filter((r) => r.status === "new").length,
      read: rows.filter((r) => r.status === "read").length,
      archived: rows.filter((r) => r.status === "archived").length,
    },
    error: null,
  }
}
