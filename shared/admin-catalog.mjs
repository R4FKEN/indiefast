import { readFile, readdir, rename, unlink, writeFile } from "node:fs/promises"
import path from "node:path"

export const CATEGORIES = [
  "1. Discover",
  "2. Research",
  "3. Validate",
  "4. Plan",
  "5. Design",
  "6. Build",
  "7. Backend",
  "8. Ship",
  "9. Monetize",
  "10. Measure",
  "11. Grow",
]

export const GROW_SUBTOPICS = [
  "Automate",
  "Scale",
  "Community",
  "Support",
  "SEO",
  "Distribution",
]

const ID_RE = /^(?:rec[A-Za-z0-9]{10,}|[a-z0-9]+(?:-[a-z0-9]+)*)$/
const LOGO_TYPES = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
}
const MAX_LOGO_BYTES = Math.floor(1.5 * 1024 * 1024)

export class CatalogError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

function catalogPath(repoRoot) {
  return path.join(repoRoot, "public", "tools.json")
}

function logoDir(repoRoot) {
  return path.resolve(repoRoot, "public", "tool-logos")
}

function assertInside(dir, filePath) {
  const relative = path.relative(dir, filePath)
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new CatalogError("Invalid logo path")
  }
}

export function isLoopback(address) {
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1"
}

function asText(value, label) {
  if (value == null) return ""
  if (typeof value !== "string") {
    throw new CatalogError(`${label} must be text`)
  }
  return value.trim()
}

function normalizeTool(input, index) {
  const label = `Tool ${index + 1}`
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new CatalogError(`${label} is not an object`)
  }

  const id = asText(input.id, `${label} id`)
  if (!ID_RE.test(id)) {
    throw new CatalogError(
      `${label}: id must be a lowercase slug (beehiiv) or an existing rec id`,
    )
  }

  const name = asText(input.Name, `${label} Name`)
  if (!name) throw new CatalogError(`${label}: Name is required`)

  const category = asText(input.Category, `${label} Category`)
  if (!CATEGORIES.includes(category)) {
    throw new CatalogError(`${label}: Category must be one of the eleven stages`)
  }

  const secondCategory = asText(input.SecondCategory, `${label} SecondCategory`)
  if (secondCategory && !CATEGORIES.includes(secondCategory)) {
    throw new CatalogError(`${label}: SecondCategory must be empty or one of the eleven stages`)
  }
  if (secondCategory && secondCategory === category) {
    throw new CatalogError(`${label}: SecondCategory must be different from Category`)
  }

  const subtopic = asText(input.Subtopic, `${label} Subtopic`)
  if (subtopic && !GROW_SUBTOPICS.includes(subtopic)) {
    throw new CatalogError(`${label}: Subtopic must be empty or one of the six Grow tracks`)
  }

  const affiliateUrl = asText(input.AffiliateURL, `${label} AffiliateURL`)
  let parsedUrl
  try {
    parsedUrl = new URL(affiliateUrl)
  } catch {
    throw new CatalogError(`${label}: AffiliateURL must be an http or https URL`)
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new CatalogError(`${label}: AffiliateURL must be an http or https URL`)
  }

  if (typeof input.Featured !== "boolean") {
    throw new CatalogError(`${label}: Featured must be true or false`)
  }

  const logoUrl = asText(input.LogoUrl, `${label} LogoUrl`)
  if (logoUrl && (!logoUrl.startsWith("/tool-logos/") || logoUrl.includes(".."))) {
    throw new CatalogError(`${label}: LogoUrl must start with /tool-logos/`)
  }

  return {
    id,
    Name: name,
    Category: category,
    SecondCategory: secondCategory,
    OneLiner: asText(input.OneLiner, `${label} OneLiner`),
    Reasoning: asText(input.Reasoning, `${label} Reasoning`),
    TimeSaved: asText(input.TimeSaved, `${label} TimeSaved`),
    Pricing: asText(input.Pricing, `${label} Pricing`),
    AffiliateURL: affiliateUrl,
    Discount: asText(input.Discount, `${label} Discount`),
    Featured: input.Featured,
    Subtopic: subtopic,
    LogoUrl: logoUrl,
  }
}

export function normalizeTools(tools) {
  if (!Array.isArray(tools)) throw new CatalogError("tools must be an array")
  const normalized = tools.map((tool, index) => normalizeTool(tool, index))
  const seen = new Set()
  for (const tool of normalized) {
    if (seen.has(tool.id)) throw new CatalogError(`Duplicate id: ${tool.id}`)
    seen.add(tool.id)
  }
  return normalized
}

function logoFileName(logoUrl) {
  if (!logoUrl.startsWith("/tool-logos/")) return ""
  const name = path.basename(logoUrl)
  if (!name || name === "." || name === ".." || name.includes("..")) return ""
  return name
}

export async function readCatalog(repoRoot) {
  const raw = await readFile(catalogPath(repoRoot), "utf8")
  const snapshot = JSON.parse(raw)
  return {
    source: "local",
    generatedAt: typeof snapshot.generatedAt === "string" ? snapshot.generatedAt : "",
    tools: Array.isArray(snapshot.tools) ? snapshot.tools : [],
    newline: raw.includes("\r\n") ? "\r\n" : "\n",
  }
}

async function writeCatalog(repoRoot, tools, newline) {
  const dest = catalogPath(repoRoot)
  const tmp = `${dest}.tmp`
  const body = JSON.stringify(
    {
      source: "local",
      generatedAt: new Date().toISOString(),
      tools,
    },
    null,
    2,
  ).replace(/\n/g, newline)
  await writeFile(tmp, body + newline, "utf8")
  await rename(tmp, dest)
}

async function removeLogoFile(repoRoot, fileName) {
  if (!fileName) return
  const dir = logoDir(repoRoot)
  const filePath = path.resolve(dir, fileName)
  assertInside(dir, filePath)
  await unlink(filePath).catch((error) => {
    if (error.code !== "ENOENT") throw error
  })
}

function unreferencedLogos(previous, next) {
  const stillUsed = new Set(next.map((tool) => logoFileName(tool.LogoUrl)).filter(Boolean))
  const nextById = new Map(next.map((tool) => [tool.id, tool]))
  const stale = []

  for (const prev of previous) {
    const updated = nextById.get(prev.id)
    const previousName = logoFileName(prev.LogoUrl || "")
    if (!previousName.startsWith(`${prev.id}.`)) continue
    if (!updated || previousName !== logoFileName(updated.LogoUrl || "")) {
      if (!stillUsed.has(previousName)) stale.push(previousName)
    }
  }

  return stale
}

export function decodeLogo({ id, contentType, dataBase64 }) {
  if (!ID_RE.test(id || "")) {
    throw new CatalogError("Logo id must be a slug or an existing rec id")
  }
  const extension = LOGO_TYPES[contentType]
  if (!extension) {
    throw new CatalogError("Logo must be a png, jpeg, webp, or gif")
  }
  if (typeof dataBase64 !== "string" || !dataBase64) {
    throw new CatalogError("Logo file is empty")
  }
  const buffer = Buffer.from(dataBase64, "base64")
  if (buffer.length === 0 || buffer.length > MAX_LOGO_BYTES) {
    throw new CatalogError("Logo must be a non-empty image under 1.5MB")
  }
  return { id, extension, buffer, logoUrl: `/tool-logos/${id}${extension}` }
}

async function writeLogo(repoRoot, decoded) {
  const dir = logoDir(repoRoot)
  const fileName = `${decoded.id}${decoded.extension}`
  const filePath = path.resolve(dir, fileName)
  assertInside(dir, filePath)
  await writeFile(filePath, decoded.buffer)
  return decoded.logoUrl
}

export async function saveCatalog(repoRoot, { tools, logo }) {
  const current = await readCatalog(repoRoot)
  let normalized = normalizeTools(tools)

  if (logo) {
    const decoded = decodeLogo(logo)
    if (!normalized.some((tool) => tool.id === decoded.id)) {
      throw new CatalogError("Logo id does not match a tool in this save")
    }
    const logoUrl = await writeLogo(repoRoot, decoded)
    normalized = normalized.map((tool) =>
      tool.id === decoded.id ? { ...tool, LogoUrl: logoUrl } : tool,
    )
  }

  await writeCatalog(repoRoot, normalized, current.newline)
  for (const fileName of unreferencedLogos(current.tools, normalized)) {
    await removeLogoFile(repoRoot, fileName)
  }

  return { source: "local", tools: normalized }
}

export async function listLogoFiles(repoRoot) {
  return readdir(logoDir(repoRoot))
}
