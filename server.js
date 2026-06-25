import express from "express"
import cors from "cors"
import Airtable from "airtable"
import path from "node:path"
import { fileURLToPath } from "node:url"
import "dotenv/config"
import { loadToolsSnapshot } from "./shared/sync-tools-snapshot.mjs"

const repoRoot = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json({ limit: "10kb" }))

const AIRTABLE_PAT = process.env.AIRTABLE_PAT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

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

function getAirtableBase() {
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    return null
  }
  return new Airtable({ apiKey: AIRTABLE_PAT }).base(AIRTABLE_BASE_ID)
}

const airtableBase = getAirtableBase()

app.get("/api/tools", async (_req, res) => {
  const tools = await loadToolsSnapshot(repoRoot)
  res.json({ tools, source: "snapshot" })
})

app.post("/api/subscribe", async (req, res) => {
  const base = airtableBase
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

  if (!base) {
    console.log(`[indiefa.st] Newsletter signup (mock): ${trimmed}`)
    return res.json({ success: true, source: "mock" })
  }

  try {
    await base("Subscribers").create([
      { fields: { Email: trimmed, SubscribedAt: new Date().toISOString() } },
    ])
    res.json({ success: true })
  } catch (error) {
    console.error("[indiefa.st] Subscribe error:", error.message)
    const status = error.statusCode === 422 ? 409 : 500
    const message =
      status === 409 ? "This email is already subscribed" : "Failed to subscribe"
    res.status(status).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`[indiefa.st] Server running on port ${PORT}`)
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    console.log(
      "[indiefa.st] WARNING: Airtable credentials not found.\n" +
      "  Set AIRTABLE_PAT and AIRTABLE_BASE_ID for newsletter signups.\n" +
      "  Tools are served from public/tools.json (run npm run sync:tools to refresh)."
    )
  }
})