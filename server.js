import express from "express"
import cors from "cors"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import "dotenv/config"
import { insertSubscriber } from "./shared/subscribe-store.mjs"
import { CatalogError, isLoopback, readCatalog, saveCatalog } from "./shared/admin-catalog.mjs"

const repoRoot = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use((req, res, next) => {
  if (req.path.startsWith("/api/admin")) return next()
  return express.json({ limit: "10kb" })(req, res, next)
})

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

app.use("/api", (req, res, next) => {
  if (req.originalUrl.startsWith("/api/admin")) return next()
  return rateLimit(req, res, next)
})

const adminJson = express.json({ limit: "3mb" })

app.use("/api/admin", (req, res, next) => {
  const address = req.socket?.remoteAddress || ""
  if (!isLoopback(address)) {
    return res.status(403).json({ error: "Affiliate admin is only available on this machine." })
  }
  return adminJson(req, res, next)
})

app.get("/api/admin/tools", async (_req, res) => {
  try {
    const catalog = await readCatalog(repoRoot)
    res.json({ tools: catalog.tools, source: "local" })
  } catch (error) {
    console.error("[indiefa.st] Failed to read public/tools.json", error)
    res.status(500).json({ error: "Could not read the affiliate catalog" })
  }
})

app.put("/api/admin/tools", async (req, res) => {
  try {
    const saved = await saveCatalog(repoRoot, {
      tools: req.body?.tools,
      logo: req.body?.logo,
    })
    console.log(`[indiefa.st] Saved ${saved.tools.length} tools to public/tools.json`)
    res.json(saved)
  } catch (error) {
    const status = error instanceof CatalogError ? error.status : 500
    if (status === 500) console.error("[indiefa.st] Affiliate admin save failed", error)
    res.status(status).json({ error: error instanceof Error ? error.message : "Save failed" })
  }
})

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.start > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip)
    }
  }
}, 5 * 60 * 1000)

app.get("/api/tools", async (_req, res) => {
  try {
    const raw = await readFile(path.join(repoRoot, "public", "tools.json"), "utf8")
    const snapshot = JSON.parse(raw)
    const tools = Array.isArray(snapshot.tools) ? snapshot.tools : []
    res.json({ tools, source: "local" })
  } catch (error) {
    console.error("[indiefa.st] Failed to read public/tools.json", error)
    res.json({ tools: [], source: "local" })
  }
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
  console.log("[indiefa.st] Affiliate admin: http://127.0.0.1:5173/admin")
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log(
      "[indiefa.st] WARNING: Supabase credentials not found.\n" +
        "  Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for newsletter signups.\n" +
        "  Tools are served from public/tools.json."
    )
  }
})
