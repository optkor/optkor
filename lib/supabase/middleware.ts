import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "./types"

const PROTECTED_PREFIX = "/admin"
const LOGIN_PATH = "/admin/login"
// Reachable while signed out — entry points into the auth flow itself.
const PUBLIC_ADMIN_PATHS = new Set([LOGIN_PATH, "/admin/forgot-password"])

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Fail open on missing config rather than crashing every request;
  // pages that actually need Supabase will surface a clear error.
  if (!url || !anonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        supabaseResponse = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options)
        }
      },
    },
  })

  const { data: userData } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const isProtected =
    pathname.startsWith(PROTECTED_PREFIX) && !PUBLIC_ADMIN_PATHS.has(pathname)

  if (isProtected) {
    if (!userData.user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = LOGIN_PATH
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    const { data: isAdmin } = await supabase.rpc("is_admin")
    if (!isAdmin) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = LOGIN_PATH
      redirectUrl.searchParams.set("error", "not_authorized")
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (pathname === LOGIN_PATH && userData.user) {
    const { data: isAdmin } = await supabase.rpc("is_admin")
    if (isAdmin) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/admin"
      redirectUrl.search = ""
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}
