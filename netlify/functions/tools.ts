import type { Context } from "@netlify/functions"
import Airtable from "airtable"

const MOCK_TOOLS = [
  {
    id: "mock_1",
    Name: "ShipFast",
    Category: "6. Build",
    SecondCategory: "8. Ship",
    OneLiner: "Next.js boilerplate with auth, payments, and SEO baked in. Ship in days, not weeks.",
    TimeSaved: "40h",
    Pricing: "One-time $199",
    AffiliateURL: "https://shipfa.st",
    Discount: "20% off",
    Featured: true,
    Subtopic: "",
  },
  {
    id: "mock_2",
    Name: "v0.dev",
    Category: "6. Build",
    SecondCategory: "5. Design",
    OneLiner: "AI-powered UI generation. Describe your component, get production-ready code.",
    TimeSaved: "15h",
    Pricing: "Free tier",
    AffiliateURL: "https://v0.dev",
    Discount: "",
    Featured: false,
    Subtopic: "",
  },
  {
    id: "mock_3",
    Name: "Tailwind UI",
    Category: "5. Design",
    SecondCategory: "",
    OneLiner: "Professionally designed, pre-built components. Drop-in and ship.",
    TimeSaved: "25h",
    Pricing: "$299 lifetime",
    AffiliateURL: "https://tailwindui.com",
    Discount: "",
    Featured: false,
    Subtopic: "",
  },
  {
    id: "mock_4",
    Name: "Supabase",
    Category: "7. Backend",
    SecondCategory: "6. Build",
    OneLiner: "Open source Firebase alternative. Postgres, Auth, Storage, Realtime in one click.",
    TimeSaved: "60h",
    Pricing: "Free tier",
    AffiliateURL: "https://supabase.com",
    Discount: "",
    Featured: true,
    Subtopic: "",
  },
  {
    id: "mock_5",
    Name: "Stripe",
    Category: "9. Monetize",
    SecondCategory: "",
    OneLiner: "The payments infrastructure for the internet. Accept payments in minutes.",
    TimeSaved: "30h",
    Pricing: "2.9% + 30c",
    AffiliateURL: "https://stripe.com",
    Discount: "",
    Featured: false,
    Subtopic: "",
  },
  {
    id: "mock_6",
    Name: "Cursor",
    Category: "6. Build",
    SecondCategory: "",
    OneLiner: "AI-first code editor. Write, edit, and debug code at the speed of thought.",
    TimeSaved: "20h",
    Pricing: "$20/mo",
    AffiliateURL: "https://cursor.com",
    Discount: "Free trial",
    Featured: false,
    Subtopic: "",
  },
  {
    id: "mock_7",
    Name: "Plausible",
    Category: "10. Measure",
    SecondCategory: "",
    OneLiner: "Lightweight, privacy-first analytics. No cookies, no consent banners.",
    TimeSaved: "10h",
    Pricing: "$9/mo",
    AffiliateURL: "https://plausible.io",
    Discount: "",
    Featured: false,
    Subtopic: "",
  },
  {
    id: "mock_8",
    Name: "Resend",
    Category: "11. Grow",
    SecondCategory: "",
    OneLiner: "Email API built for developers. Beautiful transactional emails with zero config.",
    TimeSaved: "12h",
    Pricing: "Free tier",
    AffiliateURL: "https://resend.com",
    Discount: "",
    Featured: false,
    Subtopic: "Distribution",
  },
  {
    id: "mock_9",
    Name: "Lemon Squeezy",
    Category: "9. Monetize",
    SecondCategory: "",
    OneLiner: "Merchant of record for SaaS. Subscriptions, taxes, and compliance handled.",
    TimeSaved: "50h",
    Pricing: "5% + 50c",
    AffiliateURL: "https://lemonsqueezy.com",
    Discount: "10% off first year",
    Featured: false,
    Subtopic: "",
  },
  {
    id: "mock_10",
    Name: "Shadcn/UI",
    Category: "5. Design",
    SecondCategory: "6. Build",
    OneLiner: "Copy-paste component library. Own your code, customize everything.",
    TimeSaved: "20h",
    Pricing: "Free",
    AffiliateURL: "https://ui.shadcn.com",
    Discount: "",
    Featured: false,
    Subtopic: "",
  },
  {
    id: "mock_11",
    Name: "Railway",
    Category: "7. Backend",
    SecondCategory: "8. Ship",
    OneLiner: "Deploy anything. Databases, APIs, cron jobs. Zero config infrastructure.",
    TimeSaved: "35h",
    Pricing: "Usage-based",
    AffiliateURL: "https://railway.app",
    Discount: "$5 credit",
    Featured: false,
    Subtopic: "",
  },
  {
    id: "mock_12",
    Name: "Makerkit",
    Category: "6. Build",
    SecondCategory: "",
    OneLiner: "Production-ready SaaS starter with multi-tenancy, billing, and admin panel.",
    TimeSaved: "80h",
    Pricing: "$299",
    AffiliateURL: "https://makerkit.dev",
    Discount: "",
    Featured: false,
    Subtopic: "",
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

    const records = await base("Tools").select({ view: "Grid view" }).all()

    const tools = records.map((record) => ({
      id: record.id,
      Name: record.get("Name") || "",
      Category: record.get("Category") || "",
      SecondCategory: record.get("SecondCategory") || "",
      OneLiner: record.get("OneLiner") || "",
      TimeSaved: record.get("TimeSaved") || "",
      Pricing: record.get("Pricing") || "",
      AffiliateURL: record.get("AffiliateURL") || "",
      Discount: record.get("Discount") || "",
      Featured: record.get("Featured") || false,
      Subtopic: record.get("Subtopic") || "",
    }))

    return new Response(JSON.stringify({ tools, source: "airtable" }), { headers })
  } catch (error) {
    console.error("[indiefa.st] Airtable fetch error:", error)
    return new Response(JSON.stringify({ tools: MOCK_TOOLS, source: "mock" }), { headers })
  }
}
