import express from "express"
import cors from "cors"
import Airtable from "airtable"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import "dotenv/config"

const repoRoot = path.dirname(fileURLToPath(import.meta.url))

function loadFallbackTools() {
  try {
    const snapshot = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "public", "tools.json"), "utf8")
    )
    return snapshot.tools ?? []
  } catch (error) {
    console.warn("[indiefa.st] Failed to load tools snapshot:", error.message)
    return []
  }
}

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json({ limit: "10kb" }))

const AIRTABLE_PAT = process.env.AIRTABLE_PAT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

// Server-side response cache to prevent Airtable rate limiting
let toolsCache = null
let toolsCacheTime = 0
const TOOLS_CACHE_TTL = 60 * 1000 // 1 minute

// Error backoff: don't retry Airtable immediately after failure
let lastErrorTime = 0
const ERROR_BACKOFF = 30 * 1000 // 30 seconds

// Simple rate limiter per IP
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 30 // requests per window

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

// Clean up rate limit map every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.start > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip)
    }
  }
}, 5 * 60 * 1000)

const FALLBACK_TOOLS = loadFallbackTools()

function getAirtableBase() {
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    return null
  }
  return new Airtable({ apiKey: AIRTABLE_PAT }).base(AIRTABLE_BASE_ID)
}

const airtableBase = getAirtableBase()

app.get("/api/tools", async (_req, res) => {
  if (!airtableBase) {
    console.log(
      "[indiefa.st] Airtable not configured. Serving tools snapshot.\n" +
      "To connect Airtable, set these environment variables:\n" +
      "  AIRTABLE_PAT=your_personal_access_token\n" +
      "  AIRTABLE_BASE_ID=your_base_id\n"
    )
    return res.json({ tools: FALLBACK_TOOLS, source: "snapshot" })
  }

  // Return cached response if fresh
  if (toolsCache && Date.now() - toolsCacheTime < TOOLS_CACHE_TTL) {
    return res.json({ tools: toolsCache, source: "cache" })
  }

  // Error backoff: serve stale cache or mock during backoff
  if (Date.now() - lastErrorTime < ERROR_BACKOFF) {
    if (toolsCache) {
      return res.json({ tools: toolsCache, source: "cache" })
    }
    return res.json({ tools: FALLBACK_TOOLS, source: "snapshot" })
  }

  try {
    const records = await airtableBase("Tools")
      .select({
        view: "Grid view",
      })
      .all()

    const tools = records.map((record) => ({
      id: record.id,
      Name: record.get("Name") || "",
      Category: record.get("Category") || "",
      SecondCategory: record.get("SecondCategory") || "",
      OneLiner: record.get("OneLiner") || "",
      Reasoning: record.get("Reasoning") || "",
      TimeSaved: record.get("TimeSaved") || "",
      Pricing: record.get("Pricing") || "",
      AffiliateURL: record.get("URL") || "",
      Discount: record.get("Discount") || "",
      Featured: record.get("Featured") || false,
      Subtopic: record.get("Subtopic") || "",
      LogoUrl: (() => {
        const logoAttachments = record.get("Logo")
        if (!Array.isArray(logoAttachments) || logoAttachments.length === 0) return ""
        return logoAttachments[0].thumbnails?.small?.url || logoAttachments[0].url || ""
      })(),
    }))

    // Update server cache
    toolsCache = tools
    toolsCacheTime = Date.now()

    res.json({ tools, source: "airtable" })
  } catch (error) {
    console.error("[indiefa.st] Airtable fetch error:", error.message)
    lastErrorTime = Date.now()

    // Serve stale cache on error
    if (toolsCache) {
      return res.json({ tools: toolsCache, source: "cache" })
    }
    res.status(500).json({ error: "Failed to fetch tools" })
  }
})

app.post("/api/subscribe", async (req, res) => {
  const base = airtableBase
  const { email } = req.body

  // Defensive input validation
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
      "  Set AIRTABLE_PAT and AIRTABLE_BASE_ID environment variables.\n" +
      "  Using mock data until configured."
    )
  }
})
