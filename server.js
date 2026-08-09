import express from "express"
import cors from "cors"
import path from "node:path"
import { fileURLToPath } from "node:url"
import "dotenv/config"
import { loadToolsSnapshot } from "./shared/sync-tools-snapshot.mjs"
import { insertSubscriber } from "./shared/subscribe-store.mjs"

const repoRoot = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json({ limit: "10kb" }))

const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX = 30

function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 })
    return next()
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "Too many requests. Try again later." })
  }
  return next()
}

app.use("/api", rateLimit)

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.start > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip)
    }
  }
}, 5 * 60 * 1000)

app.get("/api/tools", async (_req, res) => {
  const tools = await loadToolsSnapshot(repoRoot)
  res.json({ tools, source: "snapshot" })
})

app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" })
  }

  const trimmed = email.trim().toLowerCase()

  if (trimmed.length > 254) {
    return res.status(400).json({ error: "Email too long" })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return res.status(400).json({ error: "Valid email required" })
  }

  const result = await insertSubscriber(trimmed)

  if (!result.ok) {
    return res.status(result.status).json({ error: result.message })
  }

  if (result.source === "mock") {
    return res.json({ success: true, source: "mock" })
  }

  return res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`[indiefa.st] Server running on port ${PORT}`)
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log(
      "[indiefa.st] WARNING: Supabase credentials not found.\n" +
        "  Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for newsletter signups.\n" +
        "  Tools are served from public/tools.json (run npm run sync:tools to refresh; needs AIRTABLE_*)."
    )
  }
})
