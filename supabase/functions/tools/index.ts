import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const AIRTABLE_PAT = Deno.env.get("AIRTABLE_PAT")
    const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID")

    if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
      return new Response(
        JSON.stringify({ error: "Airtable credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    let allRecords: unknown[] = []
    let offset: string | undefined

    do {
      const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Tools`)
      if (offset) url.searchParams.set("offset", offset)

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Airtable error ${res.status}: ${text}`)
      }

      const data = await res.json() as { records: unknown[]; offset?: string }
      allRecords = allRecords.concat(data.records)
      offset = data.offset
    } while (offset)

    const tools = (allRecords as Array<{ id: string; fields: Record<string, unknown> }>).map((record) => ({
      id: record.id,
      Name: record.fields["Name"] ?? "",
      Category: record.fields["Category"] ?? "",
      OneLiner: record.fields["OneLiner"] ?? "",
      TimeSaved: record.fields["TimeSaved"] ?? "",
      Pricing: record.fields["Pricing"] ?? "",
      Discount: record.fields["Discount"] ?? "",
    }))

    return new Response(
      JSON.stringify({ tools, source: "airtable" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
