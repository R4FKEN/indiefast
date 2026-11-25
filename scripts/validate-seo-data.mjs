import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(".")
const PUBLIC_DIR = path.join(ROOT, "public")
const BLOG_DIR = path.join(ROOT, "src", "content", "blog")
const TOOL_CATALOG_PATH = path.join(PUBLIC_DIR, "tools.json")
const FEATURED_SOURCE_PATH = path.join(ROOT, "src", "data", "featured-listings.json")
const CHECK_GENERATED = process.argv.includes("--generated")

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function validateFaqSchema(markdown, fileName) {
  const heading = markdown.match(/^## FAQ Schema(?: \(JSON-LD\))?\s*$/m)
  if (!heading) return

  const section = markdown.slice(heading.index)
  const jsonBlock = section.match(/```json\s*([\s\S]*?)```/i)
  const htmlBlock = section.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
  )
  const rawSchema = jsonBlock?.[1] ?? htmlBlock?.[1]
  assert(rawSchema, `${fileName}: FAQ schema section has no JSON-LD block`)

  let schema
  try {
    schema = JSON.parse(rawSchema)
  } catch (error) {
    throw new Error(`${fileName}: invalid FAQ JSON-LD: ${error.message}`)
  }

  assert(
    schema["@context"] === "https://schema.org" ||
      schema["@context"] === "http://schema.org",
    `${fileName}: FAQ schema must use schema.org context`,
  )
  assert.equal(schema["@type"], "FAQPage", `${fileName}: FAQ schema must be FAQPage`)
  assert(
    Array.isArray(schema.mainEntity) && schema.mainEntity.length > 0,
    `${fileName}: FAQ schema must contain at least one question`,
  )

  for (const [index, question] of schema.mainEntity.entries()) {
    assert.equal(
      question["@type"],
      "Question",
      `${fileName}: FAQ item ${index + 1} must be a Question`,
    )
    assert(
      typeof question.name === "string" && question.name.trim(),
      `${fileName}: FAQ item ${index + 1} has no visible question text`,
    )
    assert.equal(
      question.acceptedAnswer?.["@type"],
      "Answer",
      `${fileName}: FAQ item ${index + 1} must have an accepted Answer`,
    )
    assert(
      typeof question.acceptedAnswer.text === "string" &&
        question.acceptedAnswer.text.trim(),
      `${fileName}: FAQ item ${index + 1} has no visible answer text`,
    )
  }
}

const toolData = readJson(TOOL_CATALOG_PATH)
assert(Array.isArray(toolData.tools), "public/tools.json must contain a tools array")
const toolIds = new Set()
for (const tool of toolData.tools) {
  assert(tool.id && tool.Name, "Every curated tool must have an id and name")
  assert(!toolIds.has(tool.id), `Duplicate curated tool id: ${tool.id}`)
  toolIds.add(tool.id)
}

const featuredData = readJson(FEATURED_SOURCE_PATH)
assert(
  Array.isArray(featuredData.featuredListings),
  "featured-listings.json source must contain a featuredListings array",
)
const featuredIds = new Set()
for (const listing of featuredData.featuredListings) {
  assert(listing.id && listing.name, "Every featured listing must have an id and name")
  assert(!featuredIds.has(listing.id), `Duplicate featured listing id: ${listing.id}`)
  assert(!toolIds.has(listing.id), `${listing.id} is duplicated in the curated catalog`)
  featuredIds.add(listing.id)
  assert(
    typeof listing.description === "string" && listing.description.trim(),
    `${listing.id}: featured listing needs a description`,
  )
  assert(
    typeof listing.placement === "string" && listing.placement.trim(),
    `${listing.id}: featured listing needs a placement label`,
  )
  assert(["http:", "https:"].includes(new URL(listing.url).protocol), `${listing.id}: invalid URL`)
  assert(
    typeof listing.logoUrl === "string" && listing.logoUrl.startsWith("/") &&
      !listing.logoUrl.startsWith("//"),
    `${listing.id}: logoUrl must be a site-relative path`,
  )
  const logoPath = path.resolve(PUBLIC_DIR, `.${listing.logoUrl}`)
  assert(
    logoPath.startsWith(`${PUBLIC_DIR}${path.sep}`) && fs.existsSync(logoPath),
    `${listing.id}: logo file does not exist in public`,
  )
}

for (const file of fs.readdirSync(BLOG_DIR).filter((entry) => entry.endsWith(".md"))) {
  validateFaqSchema(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"), file)
}

if (CHECK_GENERATED) {
  const generatedFeatured = readJson(path.join(PUBLIC_DIR, "featured-listings.json"))
  assert.deepEqual(
    generatedFeatured,
    featuredData,
    "public/featured-listings.json is out of sync with its source",
  )

  const llmsIndex = fs.readFileSync(path.join(PUBLIC_DIR, "llms.txt"), "utf8")
  const llmsFull = fs.readFileSync(path.join(PUBLIC_DIR, "llms-full.txt"), "utf8")
  const llmsFullMarkdown = fs.readFileSync(path.join(PUBLIC_DIR, "llms-full.md"), "utf8")
  const aiTxt = fs.readFileSync(path.join(PUBLIC_DIR, "ai.txt"), "utf8")
  const wellKnownAiTxt = fs.readFileSync(
    path.join(PUBLIC_DIR, ".well-known", "ai.txt"),
    "utf8",
  )
  const robotsTxt = fs.readFileSync(path.join(PUBLIC_DIR, "robots.txt"), "utf8")
  const sitemap = fs.readFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), "utf8")

  assert.equal(llmsFullMarkdown, llmsFull, "llms-full.md must match llms-full.txt")
  assert.equal(wellKnownAiTxt, aiTxt, ".well-known/ai.txt must match ai.txt")
  assert(
    llmsIndex.includes("Promotional placements shown separately"),
    "llms.txt must distinguish featured placements from curated picks",
  )
  assert(
    llmsFull.includes("promotional placements, separate from curated picks"),
    "llms-full.txt must distinguish featured placements from curated picks",
  )
  assert(aiTxt.includes("/featured-listings.json"), "ai.txt must link featured listings")
  assert(
    robotsTxt.includes("/featured-listings.json"),
    "robots.txt must advertise the featured listings index",
  )
  assert(
    sitemap.includes(`<loc>https://indiefa.st/featured-listings.json</loc>`),
    "sitemap.xml must include the featured listings index",
  )

  for (const listing of featuredData.featuredListings) {
    assert(
      llmsIndex.includes(listing.name) && llmsIndex.includes(listing.url),
      `${listing.id}: missing from llms.txt`,
    )
    assert(
      llmsFull.includes(listing.name) &&
        llmsFull.includes(listing.url) &&
        llmsFull.includes(listing.description),
      `${listing.id}: missing from llms-full.txt`,
    )
  }
}

console.log(
  `[seo] Validated ${toolData.tools.length} curated tools, ${featuredData.featuredListings.length} featured listings, and FAQ schemas`,
)
