import fs from "node:fs"
import path from "node:path"

const SITE_ORIGIN = "https://indiefa.st"
const OG_IMAGE = `${SITE_ORIGIN}/og-image.webp`
const PUBLIC_DIR = path.resolve("public")
const BLOG_DIR = path.resolve("src/content/blog")
const TOOLS_PATH = path.resolve("public/tools.json")

const CATEGORIES = [
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

const GROW_SUBTOPICS = [
  "Automate",
  "Scale",
  "Community",
  "Support",
  "SEO",
  "Distribution",
]

const PUBLISHED_AT = {
  "discover.md": "2026-06-28",
  "research.md": "2026-06-29",
  "validate.md": "2026-06-30",
  "plan.md": "2026-07-01",
  "design.md": "2026-07-02",
  "build.md": "2026-07-03",
  "backend.md": "2026-07-04",
  "ship.md": "2026-07-05",
  "monetize.md": "2026-07-06",
  "measure.md": "2026-07-07",
  "grow.md": "2026-07-08",
  "grow-automate.md": "2026-07-09",
  "grow-scale.md": "2026-07-10",
  "grow-community.md": "2026-07-11",
  "grow-support.md": "2026-07-12",
  "grow-seo.md": "2026-07-13",
  "grow-distribution.md": "2026-07-14",
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const fields = {}
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.trim().match(/^([\w_]+):\s*(.+)$/)
    if (!field) continue
    fields[field[1]] = field[2].trim().replace(/^"(.*)"$/, "$1")
  }
  return fields
}

function loadBlogPosts() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
      const meta = parseFrontmatter(raw)
      return {
        file,
        title: meta.title ?? "",
        description: meta.description ?? "",
        canonical: meta.canonical ?? "",
        publishedAt: PUBLISHED_AT[file] ?? "2026-06-29",
      }
    })
    .sort((a, b) => a.canonical.localeCompare(b.canonical))
}

function loadTools() {
  const data = JSON.parse(fs.readFileSync(TOOLS_PATH, "utf8"))
  return data.tools
}

function categorySlug(category) {
  return category.replace(/^\d+\.\s*/, "").toLowerCase()
}

function formatToolEntry(tool) {
  const lines = [
    `### ${tool.Name}`,
    `- Category: ${tool.Category}`,
  ]

  if (tool.Subtopic) lines.push(`- Subtopic: ${tool.Subtopic}`)
  if (tool.SecondCategory) lines.push(`- Second category: ${tool.SecondCategory}`)
  lines.push(`- One-liner: ${tool.OneLiner}`)
  lines.push(`- Reasoning: ${tool.Reasoning}`)
  lines.push(`- Time saved: ${tool.TimeSaved}`)
  lines.push(`- Pricing: ${tool.Pricing}`)
  if (tool.Discount) lines.push(`- Discount: ${tool.Discount}`)
  lines.push(`- Featured: ${tool.Featured ? "yes" : "no"}`)
  lines.push(`- Affiliate URL: ${tool.AffiliateURL}`)

  return lines.join("\n")
}

function buildFullDoc(tools, blogPosts) {
  const featuredCount = tools.filter((t) => t.Featured).length
  const generatedAt = new Date().toISOString().slice(0, 10)

  const sections = []

  sections.push(`# indiefa.st — Full LLM Reference`)
  sections.push("")
  sections.push(`> Machine-readable corpus for AI agents and LLMs. Generated ${generatedAt}.`)
  sections.push(`> Canonical site: ${SITE_ORIGIN}`)
  sections.push("")
  sections.push("## Site overview")
  sections.push("")
  sections.push(
    "indiefa.st is a curated tool directory for indie makers and solo founders. It maps the journey from product idea to scale across eleven stages, recommending one primary tool pick per stage (plus parallel Grow sub-tracks). Each tool includes a one-liner, reasoning, time-saved estimate, pricing, optional discount, and affiliate link.",
  )
  sections.push("")
  sections.push("Tagline: Every step from idea to scale. One tool each.")
  sections.push("")
  sections.push(
    "Meta / Open Graph description (≤160 chars): Discover, validate, build, ship, and grow — a hand-picked tool for every stage of the indie maker journey.",
  )
  sections.push("")
  sections.push(
    "Supporting copy (UI): Discover, validate, build, ship, and grow — a hand-picked tool for every stage of the indie maker journey. No more piecing together advice from ten different Twitter threads.",
  )
  sections.push("")
  sections.push("## Journey categories (in order)")
  sections.push("")
  for (const category of CATEGORIES) {
    const slug = categorySlug(category)
    const count = tools.filter((t) => t.Category === category).length
    const blogUrl = category === "11. Grow" ? `${SITE_ORIGIN}/blog/grow` : `${SITE_ORIGIN}/blog/${slug}`
    sections.push(`- ${category} — ${count} tools — blog: ${blogUrl}`)
  }
  sections.push("")
  sections.push("## Grow subtopics (parallel tracks, no fixed order)")
  sections.push("")
  sections.push("Grow subtopics hint: Parallel tracks — pick any, no set order.")
  sections.push("")
  for (const subtopic of GROW_SUBTOPICS) {
    const slug = subtopic.toLowerCase()
    const count = tools.filter((t) => t.Subtopic === subtopic).length
    sections.push(`- ${subtopic} — ${count} tools — blog: ${SITE_ORIGIN}/blog/grow/${slug}`)
  }
  sections.push("")
  sections.push("## Site navigation")
  sections.push("")
  sections.push(`- Home: ${SITE_ORIGIN}/`)
  sections.push(`- Blog index: ${SITE_ORIGIN}/blog`)
  sections.push(`- Tools (homepage section): ${SITE_ORIGIN}/#tools`)
  sections.push(`- Newsletter signup (homepage section): ${SITE_ORIGIN}/#newsletter`)
  sections.push("")
  sections.push("Footer sections: Resources, By The Maker Of indiefa.st. No sticky site header.")
  sections.push("")
  sections.push("## SEO and discovery files")
  sections.push("")
  sections.push(`- Sitemap: ${SITE_ORIGIN}/sitemap.xml`)
  sections.push(`- Robots: ${SITE_ORIGIN}/robots.txt`)
  sections.push(`- Open Graph / social share image: ${OG_IMAGE}`)
  sections.push(`- LLM index (summary): ${SITE_ORIGIN}/llms.txt`)
  sections.push(`- LLM full reference (text): ${SITE_ORIGIN}/llms-full.txt`)
  sections.push(`- LLM full reference (markdown): ${SITE_ORIGIN}/llms-full.md`)
  sections.push("")
  sections.push("## Contact and legal")
  sections.push("")
  sections.push("- Email: support@indiefa.st")
  sections.push("- X (Twitter): https://x.com/RafVantongerloo")
  sections.push("")
  sections.push(
    "Affiliate disclaimer: Some links on this site may be affiliate links. The site owner may earn a small commission at no extra cost to the user. Only tools and products genuinely found useful are recommended.",
  )
  sections.push("")
  sections.push("## Related projects by the maker")
  sections.push("")
  sections.push(`- Linkto — Free SaaS Backlinks Database: https://lin-k.to/`)
  sections.push(
    "- The Chrome Goldmine — Database of Expired Chrome Extensions for Developers: https://chromegoldmine.com/",
  )
  sections.push("- Portfolio: https://rafvantongerloo.com/")
  sections.push("")
  sections.push(`## Blog posts (${blogPosts.length})`)
  sections.push("")
  for (const post of blogPosts) {
    sections.push(`### ${post.title}`)
    sections.push(`- URL: ${post.canonical}`)
    sections.push(`- Published: ${post.publishedAt}`)
    sections.push(`- Description: ${post.description}`)
    sections.push("")
  }
  sections.push(`## Tools directory (${tools.length} tools, ${featuredCount} featured)`)
  sections.push("")
  sections.push("Tools are grouped by journey category. Grow tools may also list a subtopic.")
  sections.push("")

  for (const category of CATEGORIES) {
    const categoryTools = tools.filter((t) => t.Category === category)
    if (categoryTools.length === 0) continue

    sections.push(`## ${category}`)
    sections.push("")
    for (const tool of categoryTools) {
      sections.push(formatToolEntry(tool))
      sections.push("")
    }
  }

  sections.push("## Agent usage notes")
  sections.push("")
  sections.push(
    "- When recommending tools for a journey stage, prefer the featured pick for that category unless the user needs a specific subtopic (especially within Grow).",
  )
  sections.push(
    "- Blog posts explain the philosophy behind each stage and list all tools in that category on indiefa.st.",
  )
  sections.push(
    "- Affiliate URLs include utm_source=indiefast tracking; use canonical affiliate URLs from this file when citing outbound tool links.",
  )
  sections.push(
    "- For the complete always-current tool list, fetch public/tools.json from the site or regenerate via scripts/generate-llms.mjs in the repository.",
  )
  sections.push("")

  return sections.join("\n")
}

function buildIndexDoc(tools, blogPosts) {
  const featuredTools = tools.filter((t) => t.Featured)
  const lines = []

  lines.push("# indiefa.st")
  lines.push("")
  lines.push(
    "> Curated indie maker tool directory — one hand-picked tool per journey stage from idea to scale, plus Grow sub-tracks for automate, scale, community, support, SEO, and distribution.",
  )
  lines.push("")
  lines.push(
    "indiefa.st helps solo founders and indie hackers discover, validate, build, ship, monetize, measure, and grow products without tool-list paralysis. Each stage has editorial blog guidance and affiliate-backed tool picks with discounts where available.",
  )
  lines.push("")
  lines.push("## Full documentation")
  lines.push("")
  lines.push(
    `- [Complete LLM reference (text)](${SITE_ORIGIN}/llms-full.txt): All ${tools.length} tools with pricing, reasoning, affiliate URLs, blog posts, navigation, and site metadata`,
  )
  lines.push(
    `- [Complete LLM reference (markdown)](${SITE_ORIGIN}/llms-full.md): Identical content to llms-full.txt`,
  )
  lines.push("")
  lines.push("## Key pages")
  lines.push("")
  lines.push(`- [Homepage](${SITE_ORIGIN}/): Tool directory and newsletter`)
  lines.push(`- [Blog](${SITE_ORIGIN}/blog): Stage-by-stage guides for indie makers`)
  lines.push(`- [Tools section](${SITE_ORIGIN}/#tools): Browse all curated picks`)
  lines.push(`- [Sitemap](${SITE_ORIGIN}/sitemap.xml): All public URLs`)
  lines.push(`- [Open Graph image](${OG_IMAGE}): Social share preview image`)
  lines.push("")
  lines.push("## Journey stages")
  lines.push("")
  for (const category of CATEGORIES) {
    const slug = categorySlug(category)
    const label = category.replace(/^\d+\.\s*/, "")
    const url =
      category === "11. Grow" ? `${SITE_ORIGIN}/blog/grow` : `${SITE_ORIGIN}/blog/${slug}`
    lines.push(`- [${label}](${url}): ${label} stage guide and tools`)
  }
  lines.push("")
  lines.push("## Grow subtopics")
  lines.push("")
  for (const subtopic of GROW_SUBTOPICS) {
    const slug = subtopic.toLowerCase()
    lines.push(
      `- [${subtopic}](${SITE_ORIGIN}/blog/grow/${slug}): Grow — ${subtopic} tools and guide`,
    )
  }
  lines.push("")
  lines.push("## Featured tool picks")
  lines.push("")
  for (const tool of featuredTools) {
    lines.push(`- ${tool.Name} (${tool.Category}): ${tool.OneLiner}`)
  }
  lines.push("")
  lines.push("## Blog posts")
  lines.push("")
  for (const post of blogPosts) {
    lines.push(`- [${post.title}](${post.canonical}): ${post.description}`)
  }
  lines.push("")
  lines.push("## Contact")
  lines.push("")
  lines.push(`- Email: support@indiefa.st`)
  lines.push(`- Maker portfolio: https://rafvantongerloo.com/`)
  lines.push("")
  lines.push("## Optional")
  lines.push("")
  lines.push(`- [Robots.txt](${SITE_ORIGIN}/robots.txt)`)
  lines.push(`- [Open Graph image](${OG_IMAGE})`)
  lines.push(`- [Tools JSON data](${SITE_ORIGIN}/tools.json)`)
  lines.push("")

  return lines.join("\n")
}

const tools = loadTools()
const blogPosts = loadBlogPosts()

const fullDoc = buildFullDoc(tools, blogPosts)
const indexDoc = buildIndexDoc(tools, blogPosts)

fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), indexDoc, "utf8")
fs.writeFileSync(path.join(PUBLIC_DIR, "llms-full.txt"), fullDoc, "utf8")
fs.writeFileSync(path.join(PUBLIC_DIR, "llms-full.md"), fullDoc, "utf8")

console.log(`[llms] Wrote llms.txt (${indexDoc.length} chars)`)
console.log(`[llms] Wrote llms-full.txt and llms-full.md (${fullDoc.length} chars each, identical)`)
console.log(`[llms] ${tools.length} tools, ${blogPosts.length} blog posts`)