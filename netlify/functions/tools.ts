import type { Context } from "@netlify/functions"
import toolsSnapshot from "../../public/tools.json"

const FALLBACK_TOOLS = toolsSnapshot.tools

export default async function handler(_req: Request, _context: Context) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=31536000, immutable",
  }

  if (_req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers })
  }

  return new Response(
    JSON.stringify({ tools: FALLBACK_TOOLS, source: "snapshot" }),
    { headers }
  )
}