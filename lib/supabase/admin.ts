import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

/**
 * Service-role Supabase client. Bypasses RLS entirely.
 * Server-only — `server-only` throws a build error if this is ever
 * imported from a Client Component. Use sparingly, only where an
 * operation genuinely cannot be expressed under RLS as the signed-in
 * admin (e.g. Supabase Auth admin APIs like inviting a new admin user).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. See SUPABASE_SETUP.md."
    )
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
