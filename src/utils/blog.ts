import type { BlogPost, FaqItem } from "@/types"

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
const FAQ_SECTION_RE = /\r?\n## FAQ Schema(?: \(JSON-LD\))?[\s\S]*$/

function parseFrontmatterBlock(block: string): Record<string, string> {
  const meta: Record<string, string> = {}

  for (const line of block.split("\n")) {
    const match = line.match(/^([\w_]+):\s*(.+)$/)
    if (!match) continue

    const [, key, rawValue] = match
    const value = rawValue.trim().replace(/^"(.*)"$/, "$1")
    meta[key] = value
  }

  return meta
}

function normalizeSlug(slug: string): string {
  return slug.replace(/^\/+/, "").replace(/\/+$/, "")
}

function extractFaqSchema(section: string): Record<string, unknown> | undefined {
  const jsonMatch = section.match(/```json\r?\n([\s\S]*?)\r?\n```/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]) as Record<string, unknown>
    } catch {
      return undefined
    }
  }

  const htmlMatch = section.match(/```html\r?\n([\s\S]*?)\r?\n```/)
  if (!htmlMatch) return undefined

  const scriptMatch = htmlMatch[1].match(/<script[^>]*>([\s\S]*?)<\/script>/)
  if (!scriptMatch) return undefined

  try {
    return JSON.parse(scriptMatch[1].trim()) as Record<string, unknown>
  } catch {
    return undefined
  }
}

export function parseBlogPost(raw: string, options?: { publishedAt?: string }): BlogPost {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) {
    throw new Error("Blog post is missing frontmatter")
  }

  const meta = parseFrontmatterBlock(match[1])
  const faqSection = match[2].match(FAQ_SECTION_RE)?.[0] ?? ""
  const content = match[2].replace(FAQ_SECTION_RE, "").trim()
  const faqSchema = extractFaqSchema(faqSection)
  const slug = normalizeSlug(meta.slug ?? "")

  if (!slug) {
    throw new Error("Blog post is missing a slug")
  }

  const title = meta.title ?? "Untitled"
  const description = meta.description ?? ""

  return {
    slug,
    title,
    description,
    excerpt: description,
    publishedAt: options?.publishedAt ?? new Date().toISOString(),
    canonical: meta.canonical ?? `https://indiefa.st/blog/${slug}`,
    ogTitle: meta.og_title ?? title,
    ogDescription: meta.og_description ?? description,
    ogUrl: meta.og_url ?? `https://indiefa.st/blog/${slug}`,
    content,
    faqSchema,
  }
}

export function extractFaqItems(schema?: Record<string, unknown>): FaqItem[] {
  if (!schema) return []

  const mainEntity = schema.mainEntity
  if (!Array.isArray(mainEntity)) return []

  return mainEntity
    .map((entity) => {
      if (!entity || typeof entity !== "object") return null

      const record = entity as Record<string, unknown>
      const question = record.name
      const acceptedAnswer = record.acceptedAnswer

      if (typeof question !== "string") return null
      if (!acceptedAnswer || typeof acceptedAnswer !== "object") return null

      const answer = (acceptedAnswer as Record<string, unknown>).text
      if (typeof answer !== "string") return null

      return { question, answer }
    })
    .filter((item): item is FaqItem => item !== null)
}

export function getBlogPostBySlug(slug: string, posts: BlogPost[]): BlogPost | undefined {
  return posts.find((post) => post.slug === normalizeSlug(slug))
}