import type { BlogPost } from "@/types"
import { SITE_COPY } from "@/constants/site-copy"

const SITE_URL = "https://indiefa.st"
const ORGANIZATION_ID = `${SITE_URL}/#organization`

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface StructuredListItem {
  name: string
  url: string
  description?: string
}

export function siteIdentitySchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_COPY.name,
        url: `${SITE_URL}/`,
        description: SITE_COPY.description,
        email: "support@indiefa.st",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/indiefast-logo-nobg-500x500.png`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_COPY.name,
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  }
}

export function breadcrumbListSchema(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function blogPostingSchema(post: BlogPost): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    image: SITE_COPY.ogImage,
    url: post.canonical,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonical,
    },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en",
  }
}

export function itemListSchema(
  name: string,
  items: StructuredListItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: item.name,
        url: item.url,
        ...(item.description ? { description: item.description } : {}),
      },
    })),
  }
}

