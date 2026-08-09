import type { Context } from "@netlify/functions"
import { insertSubscriber } from "../../shared/subscribe-store.mjs"

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

  const result = await insertSubscriber(trimmed)

  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.message }), {
      status: result.status,
      headers,
    })
  }

  if (result.source === "mock") {
    return new Response(JSON.stringify({ success: true, source: "mock" }), { headers })
  }

  return new Response(JSON.stringify({ success: true }), { headers })
}
