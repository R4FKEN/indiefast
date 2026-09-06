import type { BlogPost } from "@/types"
import { parseBlogPost } from "@/utils/blog"

/** Lazy raw markdown loaders — each file becomes its own chunk. */
const rawLoaders = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>

const PUBLISHED_AT: Record<string, string> = {
  "discover.md": "2026-06-28T00:00:00.000Z",
  "research.md": "2026-06-29T00:00:00.000Z",
  "validate.md": "2026-06-30T00:00:00.000Z",
  "plan.md": "2026-07-01T00:00:00.000Z",
  "design.md": "2026-07-02T00:00:00.000Z",
  "build.md": "2026-07-03T00:00:00.000Z",
  "backend.md": "2026-07-04T00:00:00.000Z",
  "ship.md": "2026-07-05T00:00:00.000Z",
  "monetize.md": "2026-07-06T00:00:00.000Z",
  "measure.md": "2026-07-07T00:00:00.000Z",
  "grow.md": "2026-07-08T00:00:00.000Z",
  "grow-automate.md": "2026-07-09T00:00:00.000Z",
  "grow-scale.md": "2026-07-10T00:00:00.000Z",
  "grow-community.md": "2026-07-11T00:00:00.000Z",
  "grow-support.md": "2026-07-12T00:00:00.000Z",
  "grow-seo.md": "2026-07-13T00:00:00.000Z",
  "grow-distribution.md": "2026-07-14T00:00:00.000Z",
}

function fileNameFromPath(modulePath: string): string {
  const parts = modulePath.replace(/\\/g, "/").split("/")
  return parts[parts.length - 1] ?? modulePath
}

/** Map URL slug → content filename (matches frontmatter slug conventions). */
function slugToFileName(slug: string): string | undefined {
  const normalized = slug.replace(/^\/+/, "").replace(/\/+$/, "")
  if (!normalized) return undefined

  const direct = `${normalized}.md`
  if (Object.values(rawLoaders).length && PUBLISHED_AT[direct]) return direct

  if (normalized.startsWith("grow/")) {
    const growFile = `grow-${normalized.slice("grow/".length)}.md`
    if (PUBLISHED_AT[growFile]) return growFile
  }

  return undefined
}

function findLoader(fileName: string): (() => Promise<string>) | undefined {
  const entry = Object.entries(rawLoaders).find(
    ([path]) => fileNameFromPath(path) === fileName,
  )
  return entry?.[1]
}

const postBySlugCache = new Map<string, BlogPost>()
let allPostsCache: BlogPost[] | null = null

async function parseFromFile(fileName: string): Promise<BlogPost> {
  const load = findLoader(fileName)
  if (!load) {
    throw new Error(`Unknown blog file: ${fileName}`)
  }
  const raw = await load()
  return parseBlogPost(raw, {
    publishedAt: PUBLISHED_AT[fileName] ?? new Date().toISOString(),
  })
}

/** Load every post (blog index). Cached after first call. */
export async function loadAllBlogPosts(): Promise<BlogPost[]> {
  if (allPostsCache) return allPostsCache

  const fileNames = Object.keys(PUBLISHED_AT)
  const posts = await Promise.all(fileNames.map((file) => parseFromFile(file)))

  for (const post of posts) {
    postBySlugCache.set(post.slug, post)
  }

  allPostsCache = posts.sort((a, b) => a.slug.localeCompare(b.slug))
  return allPostsCache
}

/** Load a single post by URL slug (one markdown chunk). */
export async function loadBlogPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const normalized = slug.replace(/^\/+/, "").replace(/\/+$/, "")
  if (!normalized) return undefined

  const cached = postBySlugCache.get(normalized)
  if (cached) return cached

  const fileName = slugToFileName(normalized)
  if (fileName) {
    try {
      const post = await parseFromFile(fileName)
      postBySlugCache.set(post.slug, post)
      return post
    } catch {
      return undefined
    }
  }

  // Fallback: scan all if naming convention misses
  const all = await loadAllBlogPosts()
  return all.find((p) => p.slug === normalized)
}
