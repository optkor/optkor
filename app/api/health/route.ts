import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const REQUIRED_TABLES = ["projects", "project_media", "services", "contact_messages", "site_settings"] as const

/**
 * Safe, secret-free health check for verifying the Supabase connection is
 * configured and reachable. Intended for local setup verification
 * (see SUPABASE_SETUP.md) — never returns key values, only presence/booleans.
 */
export async function GET() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!hasUrl || !hasAnonKey) {
    return NextResponse.json(
      {
        ok: false,
        env: { NEXT_PUBLIC_SUPABASE_URL: hasUrl, NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnonKey },
        error: "Missing required environment variables. See SUPABASE_SETUP.md.",
      },
      { status: 503 }
    )
  }

  try {
    const supabase = await createClient()

    const results = await Promise.all(
      REQUIRED_TABLES.map(async (table) => {
        const { error } = await supabase.from(table).select("*", { count: "exact", head: true })
        return [table, !error] as const
      })
    )

    const tables = Object.fromEntries(results)
    const allReachable = results.every(([, ok]) => ok)

    return NextResponse.json(
      {
        ok: allReachable,
        env: { NEXT_PUBLIC_SUPABASE_URL: true, NEXT_PUBLIC_SUPABASE_ANON_KEY: true },
        database: { reachable: allReachable, tables },
      },
      { status: allReachable ? 200 : 503 }
    )
  } catch (err) {
    console.error("[health]", err)
    return NextResponse.json(
      { ok: false, error: "Unable to reach the database." },
      { status: 503 }
    )
  }
}
