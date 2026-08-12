"use server"

import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { createClient } from "@/lib/supabase/server"
import { ALLOWED_MEDIA_TYPES, MAX_FILE_SIZE_BYTES, mediaTypeFromMime } from "@/lib/validations/media"
import type { MutationState } from "./projects"

const BUCKET = "project-media"

function extensionFromFile(file: File): string {
  const fromName = file.name.split(".").pop()
  if (fromName && fromName.length <= 5) return fromName.toLowerCase()
  const fromMime = file.type.split("/").pop()
  return (fromMime || "bin").toLowerCase()
}

function storagePathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return url.slice(index + marker.length)
}

export async function uploadProjectMedia(
  projectId: string,
  kind: "cover" | "gallery",
  _prevState: MutationState,
  formData: FormData
): Promise<MutationState> {
  const file = formData.get("file")

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose a file to upload." }
  }
  if (!ALLOWED_MEDIA_TYPES.includes(file.type as (typeof ALLOWED_MEDIA_TYPES)[number])) {
    return { status: "error", message: `Unsupported file type: ${file.type || "unknown"}` }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { status: "error", message: "File exceeds the 50MB size limit." }
  }

  const supabase = await createClient()
  const path = `projects/${projectId}/${kind}/${randomUUID()}.${extensionFromFile(file)}`

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })

  if (uploadError) {
    console.error("[uploadProjectMedia] storage", uploadError.message)
    return { status: "error", message: "Upload failed. Please try again." }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path)

  if (kind === "cover") {
    const { error: updateError } = await supabase
      .from("projects")
      .update({ cover_image: publicUrl })
      .eq("id", projectId)

    if (updateError) {
      console.error("[uploadProjectMedia] cover db", updateError.message)
      await supabase.storage.from(BUCKET).remove([path])
      return { status: "error", message: "Upload succeeded but saving the cover image failed." }
    }
  } else {
    const { count } = await supabase
      .from("project_media")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId)

    const { error: insertError } = await supabase.from("project_media").insert({
      project_id: projectId,
      type: mediaTypeFromMime(file.type),
      url: publicUrl,
      sort_order: count ?? 0,
    })

    if (insertError) {
      console.error("[uploadProjectMedia] gallery db", insertError.message)
      await supabase.storage.from(BUCKET).remove([path])
      return { status: "error", message: "Upload succeeded but saving the media record failed." }
    }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath("/work")
  return { status: "success", message: "Upload complete." }
}

export async function deleteProjectMedia(mediaId: string, projectId: string): Promise<MutationState> {
  const supabase = await createClient()

  const { data: media, error: fetchError } = await supabase
    .from("project_media")
    .select("url")
    .eq("id", mediaId)
    .maybeSingle()

  if (fetchError || !media) {
    console.error("[deleteProjectMedia] fetch", fetchError?.message)
    return { status: "error", message: "Media item not found." }
  }

  const path = storagePathFromPublicUrl(media.url)
  if (path) {
    const { error: removeError } = await supabase.storage.from(BUCKET).remove([path])
    if (removeError) {
      console.error("[deleteProjectMedia] storage", removeError.message)
      return { status: "error", message: "Unable to delete the file from storage." }
    }
  }

  const { error: deleteError } = await supabase.from("project_media").delete().eq("id", mediaId)

  if (deleteError) {
    console.error("[deleteProjectMedia] db", deleteError.message)
    return { status: "error", message: "File removed from storage but the record could not be deleted." }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath("/work")
  return { status: "success", message: "Media deleted." }
}

export async function reorderProjectMedia(
  projectId: string,
  orderedIds: string[]
): Promise<MutationState> {
  const supabase = await createClient()
  const updates = orderedIds.map((id, index) =>
    supabase.from("project_media").update({ sort_order: index }).eq("id", id)
  )
  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)

  if (failed?.error) {
    console.error("[reorderProjectMedia]", failed.error.message)
    return { status: "error", message: "Unable to save the new order." }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  return { status: "success", message: "Order saved." }
}
