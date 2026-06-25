import fs from "node:fs/promises"
import path from "node:path"
import { AIRTABLE_TOOL_FIELDS as F } from "./airtable-fields.mjs"

export function getLogoSource(logoAttachments) {
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

export function getFileExtension(source) {
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

export function getAirtableLogoUrl(logoAttachments) {
  const source = getLogoSource(logoAttachments)
  return source?.url || ""
}

export async function findExistingLogoPath(recordId, logoDirPath) {
  try {
    const files = await fs.readdir(logoDirPath)
    const match = files.find((file) => file.startsWith(`${recordId}.`))
    return match ? `/tool-logos/${match}` : ""
  } catch {
    return ""
  }
}

export async function downloadLogo(recordId, logoAttachments, logoDirPath) {
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

export async function resolveLogoUrl(record, options = {}) {
  const { logoDirPath, downloadLogos = false, preferLiveLogo = false } = options
  const logoAttachments = record.get(F.logo)

  if (downloadLogos && logoDirPath) {
    return downloadLogo(record.id, logoAttachments, logoDirPath)
  }

  if (preferLiveLogo) {
    const liveUrl = getAirtableLogoUrl(logoAttachments)
    if (liveUrl) return liveUrl

    if (logoDirPath) {
      const localPath = await findExistingLogoPath(record.id, logoDirPath)
      if (localPath) return localPath
    }

    return ""
  }

  if (logoDirPath) {
    const localPath = await findExistingLogoPath(record.id, logoDirPath)
    if (localPath) return localPath
  }

  return getAirtableLogoUrl(logoAttachments)
}