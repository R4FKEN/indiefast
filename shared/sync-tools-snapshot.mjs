import fs from "node:fs/promises"
import path from "node:path"
import Airtable from "airtable"
import { mapAirtableRecords } from "./map-airtable-record.mjs"

export function getSnapshotPaths(repoRoot) {
  return {
    outputPath: path.join(repoRoot, "public", "tools.json"),
    logoDirPath: path.join(repoRoot, "public", "tool-logos"),
  }
}

export async function loadToolsSnapshot(repoRoot) {
  const { outputPath } = getSnapshotPaths(repoRoot)

  try {
    const snapshot = JSON.parse(await fs.readFile(outputPath, "utf8"))
    return snapshot.tools ?? []
  } catch {
    return []
  }
}

export async function writeToolsSnapshot(tools, repoRoot) {
  const { outputPath } = getSnapshotPaths(repoRoot)

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
}

export async function syncToolsSnapshot({
  repoRoot = process.cwd(),
  refreshLogos = true,
} = {}) {
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
  const { outputPath, logoDirPath } = getSnapshotPaths(repoRoot)

  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    try {
      await fs.access(outputPath)
      const tools = await loadToolsSnapshot(repoRoot)
      console.log("[tools snapshot] Airtable env missing, keeping existing public/tools.json")
      return { tools, source: "snapshot" }
    } catch {
      throw new Error(
        "AIRTABLE_PAT or AIRTABLE_BASE_ID is missing and no existing public/tools.json was found."
      )
    }
  }

  const base = new Airtable({ apiKey: AIRTABLE_PAT }).base(AIRTABLE_BASE_ID)
  const records = await base("Tools").select({ view: "Grid view" }).all()

  if (refreshLogos) {
    await fs.rm(logoDirPath, { recursive: true, force: true })
    await fs.mkdir(logoDirPath, { recursive: true })
  }

  const tools = await mapAirtableRecords(records, {
    logoDirPath,
    downloadLogos: refreshLogos,
  })

  await writeToolsSnapshot(tools, repoRoot)
  console.log(`[tools snapshot] Wrote ${tools.length} tools to public/tools.json`)

  return { tools, source: "airtable" }
}

export function buildLogoUrlMap(tools) {
  return Object.fromEntries(
    tools
      .filter((tool) => tool.LogoUrl)
      .map((tool) => [tool.id, tool.LogoUrl])
  )
}