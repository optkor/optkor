import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

/**
 * Anon-key client with no cookies()/request dependency. Use this only from
 * contexts that run outside an incoming request — build-time special files
 * like sitemap.ts and robots.ts — where the cookie-bound client in
 * server.ts would throw or behave unpredictably. Every table it can reach
 * is still governed by RLS as the anon role, so it only ever sees
 * published rows.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. See SUPABASE_SETUP.md."
    )
  }

  return createSupabaseClient<Database>(url, anonKey)
}
