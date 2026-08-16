import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/**
 * Exchanges the one-time code from a Supabase auth email link (password
 * recovery, invite, etc.) for a real session, then hands off to `next`.
 * No incoming link should ever be trusted blindly — exchangeCodeForSession
 * itself is the verification; an invalid/expired/reused code fails here.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/admin"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error("[auth/confirm] exchangeCodeForSession", error.message)
  }

  return NextResponse.redirect(`${origin}/admin/login?error=reset_link_invalid`)
}
