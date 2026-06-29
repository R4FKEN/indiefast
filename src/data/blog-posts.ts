import type { BlogPost } from "@/types"
import { parseBlogPost } from "@/utils/blog"
import discoverRaw from "@/content/blog/discover.md?raw"
import researchRaw from "@/content/blog/research.md?raw"
import validateRaw from "@/content/blog/validate.md?raw"
import planRaw from "@/content/blog/plan.md?raw"
import designRaw from "@/content/blog/design.md?raw"
import buildRaw from "@/content/blog/build.md?raw"
import backendRaw from "@/content/blog/backend.md?raw"
import shipRaw from "@/content/blog/ship.md?raw"
import monetizeRaw from "@/content/blog/monetize.md?raw"
import measureRaw from "@/content/blog/measure.md?raw"
import growRaw from "@/content/blog/grow.md?raw"
import growAutomateRaw from "@/content/blog/grow-automate.md?raw"
import growScaleRaw from "@/content/blog/grow-scale.md?raw"
import growCommunityRaw from "@/content/blog/grow-community.md?raw"
import growSupportRaw from "@/content/blog/grow-support.md?raw"
import growSeoRaw from "@/content/blog/grow-seo.md?raw"
import growDistributionRaw from "@/content/blog/grow-distribution.md?raw"

export const BLOG_POSTS: BlogPost[] = [
  parseBlogPost(discoverRaw, { publishedAt: "2026-06-28T00:00:00.000Z" }),
  parseBlogPost(researchRaw, { publishedAt: "2026-06-29T00:00:00.000Z" }),
  parseBlogPost(validateRaw, { publishedAt: "2026-06-30T00:00:00.000Z" }),
  parseBlogPost(planRaw, { publishedAt: "2026-07-01T00:00:00.000Z" }),
  parseBlogPost(designRaw, { publishedAt: "2026-07-02T00:00:00.000Z" }),
  parseBlogPost(buildRaw, { publishedAt: "2026-07-03T00:00:00.000Z" }),
  parseBlogPost(backendRaw, { publishedAt: "2026-07-04T00:00:00.000Z" }),
  parseBlogPost(shipRaw, { publishedAt: "2026-07-05T00:00:00.000Z" }),
  parseBlogPost(monetizeRaw, { publishedAt: "2026-07-06T00:00:00.000Z" }),
  parseBlogPost(measureRaw, { publishedAt: "2026-07-07T00:00:00.000Z" }),
  parseBlogPost(growRaw, { publishedAt: "2026-07-08T00:00:00.000Z" }),
  parseBlogPost(growAutomateRaw, { publishedAt: "2026-07-09T00:00:00.000Z" }),
  parseBlogPost(growScaleRaw, { publishedAt: "2026-07-10T00:00:00.000Z" }),
  parseBlogPost(growCommunityRaw, { publishedAt: "2026-07-11T00:00:00.000Z" }),
  parseBlogPost(growSupportRaw, { publishedAt: "2026-07-12T00:00:00.000Z" }),
  parseBlogPost(growSeoRaw, { publishedAt: "2026-07-13T00:00:00.000Z" }),
  parseBlogPost(growDistributionRaw, { publishedAt: "2026-07-14T00:00:00.000Z" }),
]