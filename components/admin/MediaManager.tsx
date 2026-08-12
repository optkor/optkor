"use client"

import { useRef, useState, useTransition } from "react"
import { SafeImage, VideoPlayer } from "@/components/ui/Media"
import { useToast } from "@/components/ui/Toast"
import {
  deleteProjectMedia,
  reorderProjectMedia,
  uploadProjectMedia,
} from "@/lib/mutations/media"
import { validateMediaFile } from "@/lib/validations/media"
import type { ProjectMedia } from "@/lib/supabase/types"

const emptyState = { status: "idle" as const, message: "" }

export function CoverUpload({ projectId, coverImage }: { projectId: string; coverImage: string | null }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    const validation = validateMediaFile(file)
    if (!validation.valid) {
      toast(validation.error, "error")
      return
    }
    const formData = new FormData()
    formData.set("file", file)
    startTransition(async () => {
      const result = await uploadProjectMedia(projectId, "cover", emptyState, formData)
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">Cover Image</p>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden bg-ink-3">
          {coverImage ? (
            <SafeImage src={coverImage} alt="Cover" fill sizes="128px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">No cover</div>
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ""
            }}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="border border-line-strong px-4 py-2 text-xs uppercase tracking-wider text-paper hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {pending ? "Uploading…" : coverImage ? "Replace cover" : "Upload cover"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function GalleryManager({ projectId, media }: { projectId: string; media: ProjectMedia[] }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState(media)

  function handleFiles(files: FileList) {
    const list = Array.from(files)
    for (const file of list) {
      const validation = validateMediaFile(file)
      if (!validation.valid) {
        toast(`${file.name}: ${validation.error}`, "error")
        continue
      }
      const formData = new FormData()
      formData.set("file", file)
      startTransition(async () => {
        const result = await uploadProjectMedia(projectId, "gallery", emptyState, formData)
        toast(result.message, result.status === "error" ? "error" : "success")
      })
    }
  }

  function handleDelete(mediaId: string) {
    startTransition(async () => {
      const result = await deleteProjectMedia(mediaId, projectId)
      if (result.status !== "error") {
        setItems((prev) => prev.filter((m) => m.id !== mediaId))
      }
      toast(result.message, result.status === "error" ? "error" : "success")
    })
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    startTransition(async () => {
      const result = await reorderProjectMedia(
        projectId,
        next.map((m) => m.id)
      )
      if (result.status === "error") toast(result.message, "error")
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">Gallery</p>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files)
              e.target.value = ""
            }}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="border border-line-strong px-4 py-2 text-xs uppercase tracking-wider text-paper hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {pending ? "Uploading…" : "Add media"}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No gallery media yet.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <li key={item.id} className="group relative overflow-hidden bg-ink-3">
              <div className="relative aspect-square w-full">
                {item.type === "video" ? (
                  <VideoPlayer src={item.url} />
                ) : (
                  <SafeImage
                    src={item.url}
                    alt={item.alt ?? ""}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex items-center justify-between gap-1 bg-ink-2 px-2 py-1.5 text-xs">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={pending || index === 0}
                    onClick={() => move(index, -1)}
                    className="text-muted hover:text-accent disabled:opacity-30"
                    aria-label="Move earlier"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={pending || index === items.length - 1}
                    onClick={() => move(index, 1)}
                    className="text-muted hover:text-accent disabled:opacity-30"
                    aria-label="Move later"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(item.id)}
                  className="text-danger hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
