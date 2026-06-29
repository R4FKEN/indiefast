export interface Tool {
  id: string
  Name: string
  Category: string
  SecondCategory: string
  OneLiner: string
  Reasoning?: string
  TimeSaved: string
  Pricing: string
  /** Outbound link — synced from Airtable column "URL" (not "AffiliateURL") */
  AffiliateURL: string
  Discount: string
  Featured: boolean
  Subtopic: string
  LogoUrl?: string
}

export type Category =
  | "All"
  | "1. Discover"
  | "2. Research"
  | "3. Validate"
  | "4. Plan"
  | "5. Design"
  | "6. Build"
  | "7. Backend"
  | "8. Ship"
  | "9. Monetize"
  | "10. Measure"
  | "11. Grow"

export type GrowSubtopic =
  | "Automate"
  | "Scale"
  | "Community"
  | "Support"
  | "SEO"
  | "Distribution"

export interface FaqItem {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  excerpt: string
  publishedAt: string
  canonical: string
  ogTitle: string
  ogDescription: string
  ogUrl: string
  content: string
  faqSchema?: Record<string, unknown>
}
