import express from "express"
import cors from "cors"
import Airtable from "airtable"
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3001

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

const MOCK_TOOLS = [
  {
    id: "mock_1",
    Name: "ShipFast",
    Category: "6. Build",
    OneLiner: "Next.js boilerplate with auth, payments, and SEO baked in. Ship in days, not weeks.",
    TimeSaved: "40h",
    Pricing: "One-time $199",
    AffiliateURL: "https://shipfa.st",
    Discount: "20% off",
    Featured: true,
  },
  {
    id: "mock_2",
    Name: "v0.dev",
    Category: "6. Build",
    OneLiner: "AI-powered UI generation. Describe your component, get production-ready code.",
    TimeSaved: "15h",
    Pricing: "Free tier",
    AffiliateURL: "https://v0.dev",
    Discount: "",
    Featured: false,
  },
  {
    id: "mock_3",
    Name: "Tailwind UI",
    Category: "5. Design",
    OneLiner: "Professionally designed, pre-built components. Drop-in and ship.",
    TimeSaved: "25h",
    Pricing: "$299 lifetime",
    AffiliateURL: "https://tailwindui.com",
    Discount: "",
    Featured: false,
  },
  {
    id: "mock_4",
    Name: "Supabase",
    Category: "7. Backend",
    OneLiner: "Open source Firebase alternative. Postgres, Auth, Storage, Realtime in one click.",
    TimeSaved: "60h",
    Pricing: "Free tier",
    AffiliateURL: "https://supabase.com",
    Discount: "",
    Featured: true,
  },
  {
    id: "mock_5",
    Name: "Stripe",
    Category: "9. Monetize",
    OneLiner: "The payments infrastructure for the internet. Accept payments in minutes.",
    TimeSaved: "30h",
    Pricing: "2.9% + 30c",
    AffiliateURL: "https://stripe.com",
    Discount: "",
    Featured: false,
  },
  {
    id: "mock_6",
    Name: "Cursor",
    Category: "6. Build",
    OneLiner: "AI-first code editor. Write, edit, and debug code at the speed of thought.",
    TimeSaved: "20h",
    Pricing: "$20/mo",
    AffiliateURL: "https://cursor.com",
    Discount: "Free trial",
    Featured: false,
  },
  {
    id: "mock_7",
    Name: "Plausible",
    Category: "10. Measure",
    OneLiner: "Lightweight, privacy-first analytics. No cookies, no consent banners.",
    TimeSaved: "10h",
    Pricing: "$9/mo",
    AffiliateURL: "https://plausible.io",
    Discount: "",
    Featured: false,
  },
  {
    id: "mock_8",
    Name: "Resend",
    Category: "11. Grow",
    OneLiner: "Email API built for developers. Beautiful transactional emails with zero config.",
    TimeSaved: "12h",
    Pricing: "Free tier",
    AffiliateURL: "https://resend.com",
    Discount: "",
    Featured: false,
  },
  {
    id: "mock_9",
    Name: "Lemon Squeezy",
    Category: "9. Monetize",
    OneLiner: "Merchant of record for SaaS. Subscriptions, taxes, and compliance handled.",
    TimeSaved: "50h",
    Pricing: "5% + 50c",
    AffiliateURL: "https://lemonsqueezy.com",
    Discount: "10% off first year",
    Featured: false,
  },
  {
    id: "mock_10",
    Name: "Shadcn/UI",
    Category: "5. Design",
    OneLiner: "Copy-paste component library. Own your code, customize everything.",
    TimeSaved: "20h",
    Pricing: "Free",
    AffiliateURL: "https://ui.shadcn.com",
    Discount: "",
    Featured: false,
  },
  {
    id: "mock_11",
    Name: "Railway",
    Category: "7. Backend",
    OneLiner: "Deploy anything. Databases, APIs, cron jobs. Zero config infrastructure.",
    TimeSaved: "35h",
    Pricing: "Usage-based",
    AffiliateURL: "https://railway.app",
    Discount: "$5 credit",
    Featured: false,
  },
  {
    id: "mock_12",
    Name: "Makerkit",
    Category: "6. Build",
    OneLiner: "Production-ready SaaS starter with multi-tenancy, billing, and admin panel.",
    TimeSaved: "80h",
    Pricing: "$299",
    AffiliateURL: "https://makerkit.dev",
    Discount: "",
    Featured: false,
  },
]

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
      "[indiefa.st] Airtable not configured. Serving mock data.\n" +
      "To connect Airtable, set these environment variables:\n" +
      "  AIRTABLE_PAT=your_personal_access_token\n" +
      "  AIRTABLE_BASE_ID=your_base_id\n"
    )
    return res.json({ tools: MOCK_TOOLS, source: "mock" })
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
    return res.json({ tools: MOCK_TOOLS, source: "mock" })
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
      AffiliateURL: record.get("AffiliateURL") || "",
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
    res.status(500).json({ error: "Failed to subscribe" })
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
