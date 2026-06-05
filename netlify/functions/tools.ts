import type { Context } from "@netlify/functions"
import Airtable from "airtable"

const MOCK_TOOLS = [
  {
    id: "mock_1",
    Name: "ShipFast",
    Category: "6. Build",
    OneLiner: "Next.js boilerplate with auth, payments, and SEO baked in. Ship in days, not weeks.",
    TimeSaved: "40h",
    Pricing: "One-time $199",
    Discount: "20% off",
  },
  {
    id: "mock_2",
    Name: "v0.dev",
    Category: "6. Build",
    OneLiner: "AI-powered UI generation. Describe your component, get production-ready code.",
    TimeSaved: "15h",
    Pricing: "Free tier",
    Discount: "",
  },
  {
    id: "mock_3",
    Name: "Tailwind UI",
    Category: "5. Design",
    OneLiner: "Professionally designed, pre-built components. Drop-in and ship.",
    TimeSaved: "25h",
    Pricing: "$299 lifetime",
    Discount: "",
  },
  {
    id: "mock_4",
    Name: "Supabase",
    Category: "7. Backend",
    OneLiner: "Open source Firebase alternative. Postgres, Auth, Storage, Realtime in one click.",
    TimeSaved: "60h",
    Pricing: "Free tier",
    Discount: "",
  },
  {
    id: "mock_5",
    Name: "Stripe",
    Category: "9. Monetize",
    OneLiner: "The payments infrastructure for the internet. Accept payments in minutes.",
    TimeSaved: "30h",
    Pricing: "2.9% + 30c",
    Discount: "",
  },
  {
    id: "mock_6",
    Name: "Cursor",
    Category: "6. Build",
    OneLiner: "AI-first code editor. Write, edit, and debug code at the speed of thought.",
    TimeSaved: "20h",
    Pricing: "$20/mo",
    Discount: "Free trial",
  },
  {
    id: "mock_7",
    Name: "Plausible",
    Category: "10. Measure",
    OneLiner: "Lightweight, privacy-first analytics. No cookies, no consent banners.",
    TimeSaved: "10h",
    Pricing: "$9/mo",
    Discount: "",
  },
  {
    id: "mock_8",
    Name: "Resend",
    Category: "11. Grow",
    OneLiner: "Email API built for developers. Beautiful transactional emails with zero config.",
    TimeSaved: "12h",
    Pricing: "Free tier",
    Discount: "",
  },
  {
    id: "mock_9",
    Name: "Lemon Squeezy",
    Category: "9. Monetize",
    OneLiner: "Merchant of record for SaaS. Subscriptions, taxes, and compliance handled.",
    TimeSaved: "50h",
    Pricing: "5% + 50c",
    Discount: "10% off first year",
  },
  {
    id: "mock_10",
    Name: "Shadcn/UI",
    Category: "5. Design",
    OneLiner: "Copy-paste component library. Own your code, customize everything.",
    TimeSaved: "20h",
    Pricing: "Free",
    Discount: "",
  },
  {
    id: "mock_11",
    Name: "Railway",
    Category: "7. Backend",
    OneLiner: "Deploy anything. Databases, APIs, cron jobs. Zero config infrastructure.",
    TimeSaved: "35h",
    Pricing: "Usage-based",
    Discount: "$5 credit",
  },
  {
    id: "mock_12",
    Name: "Makerkit",
    Category: "6. Build",
    OneLiner: "Production-ready SaaS starter with multi-tenancy, billing, and admin panel.",
    TimeSaved: "80h",
    Pricing: "$299",
    Discount: "",
  },
]

export default async function handler(_req: Request, _context: Context) {
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  if (_req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers })
  }

  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    return new Response(JSON.stringify({ tools: MOCK_TOOLS, source: "mock" }), { headers })
  }

  try {
    const airtable = new Airtable({ apiKey: AIRTABLE_PAT })
    const base = airtable.base(AIRTABLE_BASE_ID)

    const records = await base("Tools").select({}).all()

    const tools = records.map((record) => ({
      id: record.id,
      Name: record.get("Name") || "",
      Category: record.get("Category") || "",
      OneLiner: record.get("OneLiner") || "",
      TimeSaved: record.get("TimeSaved") || "",
      Pricing: record.get("Pricing") || "",
      Discount: record.get("Discount") || "",
    }))

    return new Response(JSON.stringify({ tools, source: "airtable" }), { headers })
  } catch (error) {
    console.error("[indiefa.st] Airtable fetch error:", error)
    return new Response(JSON.stringify({ tools: MOCK_TOOLS, source: "mock" }), { headers })
  }
}
