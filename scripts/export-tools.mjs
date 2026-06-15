import "dotenv/config"
import fs from "node:fs/promises"
import path from "node:path"
import Airtable from "airtable"

const AIRTABLE_PAT = process.env.AIRTABLE_PAT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

const repoRoot = process.cwd()
const outputPath = path.join(repoRoot, "public", "tools.json")
const logoDirPath = path.join(repoRoot, "public", "tool-logos")

function getLogoSource(logoAttachments) {
  if (!Array.isArray(logoAttachments) || logoAttachments.length === 0) return null

  const attachment = logoAttachments[0]
  const sourceUrl = attachment.thumbnails?.small?.url || attachment.url || ""

  if (!sourceUrl) return null

  return {
    url: sourceUrl,
    filename: attachment.filename || "",
    type: attachment.type || "",
  }
}

function getFileExtension(source) {
  const fromFilename = path.extname(source.filename || "")
  if (fromFilename) return fromFilename.toLowerCase()

  try {
    const url = new URL(source.url)
    const fromUrl = path.extname(url.pathname)
    if (fromUrl) return fromUrl.toLowerCase()
  } catch {
    // ignore malformed URL and fall through
  }

  if (source.type === "image/jpeg") return ".jpg"
  if (source.type === "image/png") return ".png"
  if (source.type === "image/webp") return ".webp"
  if (source.type === "image/gif") return ".gif"
  if (source.type === "image/svg+xml") return ".svg"

  return ".png"
}

async function downloadLogo(recordId, logoAttachments) {
  const source = getLogoSource(logoAttachments)
  if (!source) return ""

  try {
    const response = await fetch(source.url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const extension = getFileExtension(source)
    const fileName = `${recordId}${extension}`
    const filePath = path.join(logoDirPath, fileName)

    await fs.writeFile(filePath, Buffer.from(arrayBuffer))
    return `/tool-logos/${fileName}`
  } catch (error) {
    console.warn(`[tools snapshot] Failed to download logo for ${recordId}: ${error.message}`)
    return ""
  }
}

async function mapTool(record) {
  const logoAttachments = record.get("Logo")

  return {
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
    LogoUrl: await downloadLogo(record.id, logoAttachments),
  }
}

async function main() {
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    try {
      await fs.access(outputPath)
      console.log("[tools snapshot] Airtable env missing, keeping existing public/tools.json")
      return
    } catch {
      throw new Error("AIRTABLE_PAT or AIRTABLE_BASE_ID is missing and no existing public/tools.json was found.")
    }
  }

  const base = new Airtable({ apiKey: AIRTABLE_PAT }).base(AIRTABLE_BASE_ID)
  const records = await base("Tools").select({ view: "Grid view" }).all()

  await fs.rm(logoDirPath, { recursive: true, force: true })
  await fs.mkdir(logoDirPath, { recursive: true })

  const tools = await Promise.all(records.map(mapTool))

  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        source: "airtable-snapshot",
        generatedAt: new Date().toISOString(),
        tools,
      },
      null,
      2
    ) + "\n",
    "utf8"
  )

  console.log(`[tools snapshot] Wrote ${tools.length} tools to public/tools.json`)
}

main().catch((error) => {
  console.error("[tools snapshot] Failed:", error.message)
  process.exit(1)
})
