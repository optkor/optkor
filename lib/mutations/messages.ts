"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { MessageStatus } from "@/lib/supabase/types"
import type { MutationState } from "./projects"

export async function setMessageStatus(id: string, status: MessageStatus): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id)

  if (error) {
    console.error("[setMessageStatus]", error.message)
    return { status: "error", message: "Unable to update the message." }
  }

  revalidatePath("/admin/messages")
  return { status: "success", message: "Message updated." }
}

export async function deleteMessage(id: string): Promise<MutationState> {
  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)

  if (error) {
    console.error("[deleteMessage]", error.message)
    return { status: "error", message: "Unable to delete the message." }
  }

  revalidatePath("/admin/messages")
  return { status: "success", message: "Message deleted." }
}
