import type { Context } from "@netlify/functions"
import Airtable from "airtable"
import toolsSnapshot from "../../public/tools.json"

const FALLBACK_TOOLS = toolsSnapshot.tools

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
    return new Response(JSON.stringify({ tools: FALLBACK_TOOLS, source: "snapshot" }), { headers })
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

    return new Response(JSON.stringify({ tools, source: "airtable" }), { headers })
  } catch (error) {
    console.error("[indiefa.st] Airtable fetch error:", error)
    return new Response(JSON.stringify({ tools: FALLBACK_TOOLS, source: "snapshot" }), { headers })
  }
}
