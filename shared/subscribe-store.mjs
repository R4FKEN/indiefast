import { createClient } from "@supabase/supabase-js"

/**
 * Insert a newsletter subscriber into Supabase.
 * Email must already be trimmed + lowercased by the caller.
 *
 * @param {string} email
 * @returns {Promise<
 *   | { ok: true, source?: "mock" }
 *   | { ok: false, status: number, message: string }
 * >}
 */
export async function insertSubscriber(email) {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    console.log(`[indiefa.st] Newsletter signup (mock): ${email}`)
    return { ok: true, source: "mock" }
  }

  try {
    const supabase = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { error } = await supabase.from("subscribers").insert({ email })

    if (error) {
      // Postgres unique_violation
      if (error.code === "23505") {
        return {
          ok: false,
          status: 409,
          message: "This email is already subscribed",
        }
      }

      console.error("[indiefa.st] Subscribe error:", error.message ?? error)
      return { ok: false, status: 500, message: "Failed to subscribe" }
    }

    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[indiefa.st] Subscribe error:", message)
    return { ok: false, status: 500, message: "Failed to subscribe" }
  }
}
