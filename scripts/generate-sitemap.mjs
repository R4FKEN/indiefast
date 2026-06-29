import fs from "node:fs"
import path from "node:path"

const SITE_ORIGIN = "https://indiefa.st"
const BLOG_DIR = path.resolve("src/content/blog")
const OUTPUT = path.resolve("public/sitemap.xml")

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

function parseCanonical(markdown) {
  const match = markdown.match(/^canonical:\s*(.+)$/m)
  return match?.[1]?.trim()
}

function toSitemapDate(isoDate) {
  return isoDate.slice(0, 10)
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n")
}

const blogEntries = fs
  .readdirSync(BLOG_DIR)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8")
    const canonical = parseCanonical(raw)
    if (!canonical) {
      throw new Error(`Missing canonical in ${file}`)
    }

    return {
      loc: canonical,
      lastmod: toSitemapDate(PUBLISHED_AT[file] ?? "2026-06-29"),
      changefreq: "monthly",
      priority: "0.7",
    }
  })
  .sort((a, b) => a.loc.localeCompare(b.loc))

const latestBlogDate = blogEntries.reduce(
  (latest, entry) => (entry.lastmod > latest ? entry.lastmod : latest),
  "2026-06-29",
)

const entries = [
  {
    loc: `${SITE_ORIGIN}/`,
    lastmod: latestBlogDate,
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    loc: `${SITE_ORIGIN}/blog`,
    lastmod: latestBlogDate,
    changefreq: "weekly",
    priority: "0.8",
  },
  ...blogEntries,
]

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(urlEntry),
  "</urlset>",
  "",
].join("\n")

fs.writeFileSync(OUTPUT, xml, "utf8")
console.log(`[sitemap] Wrote ${entries.length} URLs to ${OUTPUT}`)