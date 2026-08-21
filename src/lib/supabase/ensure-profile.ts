import type { SupabaseClient, User } from "@supabase/supabase-js"

/**
 * Create a profiles row only when missing.
 * Never updates role (or any other column) on existing rows.
 *
 * If admin role still resets after login, a Supabase trigger on
 * auth.users (often INSERT OR UPDATE) is overwriting profiles.role.
 * Keep that trigger INSERT-only and ON CONFLICT DO NOTHING for role.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User | null | undefined
) {
  if (!user) return

  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle()

  if (selectError) {
    console.error("ensureProfile select", selectError)
    return
  }

  if (existing) return

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    role: "student",
  })

  // Concurrent insert (trigger or another tab) — not an overwrite of role
  if (insertError && insertError.code !== "23505") {
    console.error("ensureProfile insert", insertError)
  }
}
