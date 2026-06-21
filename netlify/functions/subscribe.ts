import type { Context } from "@netlify/functions"
import Airtable from "airtable"

export default async function handler(req: Request, _context: Context) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers })
  }

  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400, headers })
  }

  const { email } = body
  if (!email || typeof email !== "string") {
    return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers })
  }

  const trimmed = email.trim().toLowerCase()

  if (trimmed.length > 254) {
    return new Response(JSON.stringify({ error: "Email too long" }), { status: 400, headers })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return new Response(JSON.stringify({ error: "Valid email required" }), { status: 400, headers })
  }

  const AIRTABLE_PAT = process.env.AIRTABLE_PAT
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    console.log(`[indiefa.st] Newsletter signup (mock): ${trimmed}`)
    return new Response(JSON.stringify({ success: true, source: "mock" }), { headers })
  }

  try {
    const airtable = new Airtable({ apiKey: AIRTABLE_PAT })
    const base = airtable.base(AIRTABLE_BASE_ID)

    await base("Subscribers").create([
      { fields: { Email: trimmed, SubscribedAt: new Date().toISOString() } },
    ])

    return new Response(JSON.stringify({ success: true }), { headers })
  } catch (error) {
    const err = error as { message?: string; statusCode?: number }
    console.error("[indiefa.st] Subscribe error:", err.message ?? error)
    const status = err.statusCode === 422 ? 409 : 500
    const message =
      status === 409 ? "This email is already subscribed" : "Failed to subscribe"
    return new Response(JSON.stringify({ error: message }), { status, headers })
  }
}
