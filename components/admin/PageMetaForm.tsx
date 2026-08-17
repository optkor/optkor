"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { FormField, Input, Textarea } from "@/components/ui/FormField"
import { savePageMeta } from "@/lib/mutations/page-meta"
import { PAGE_META_PAGES } from "@/lib/data/page-meta-pages"
import type { MutationState } from "@/lib/mutations/projects"

const initialState: MutationState = { status: "idle", message: "" }

function fieldName(slug: string, field: string) {
  return `${slug}__${field}`
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-accent-soft disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save SEO Settings"}
    </button>
  )
}

export function PageMetaForm({
  values,
}: {
  values: Record<string, { seo_title: string; seo_description: string; og_image: string }>
}) {
  const [state, formAction] = useActionState(savePageMeta, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-12">
      {PAGE_META_PAGES.map(({ slug, label, path }) => {
        const current = values[slug] ?? { seo_title: "", seo_description: "", og_image: "" }
        return (
          <div key={slug}>
            <h2 className="font-display text-lg text-paper">
              {label} <span className="text-sm font-sans text-muted">{path}</span>
            </h2>
            <div className="mt-6 flex flex-col gap-6 border-t border-line pt-6">
              <FormField
                label="SEO Title"
                htmlFor={fieldName(slug, "seo_title")}
                hint="Leave blank to use the page's default title."
              >
                <Input
                  id={fieldName(slug, "seo_title")}
                  name={fieldName(slug, "seo_title")}
                  defaultValue={current.seo_title}
                />
              </FormField>
              <FormField
                label="SEO Description"
                htmlFor={fieldName(slug, "seo_description")}
                hint="Leave blank to use the page's default description."
              >
                <Textarea
                  id={fieldName(slug, "seo_description")}
                  name={fieldName(slug, "seo_description")}
                  rows={3}
                  defaultValue={current.seo_description}
                />
              </FormField>
              <FormField
                label="Social Share Image URL"
                htmlFor={fieldName(slug, "og_image")}
                hint="Used for social previews (Open Graph / Twitter cards)."
              >
                <Input
                  id={fieldName(slug, "og_image")}
                  name={fieldName(slug, "og_image")}
                  defaultValue={current.og_image}
                />
              </FormField>
            </div>
          </div>
        )
      })}

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
