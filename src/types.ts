export interface Tool {
  id: string
  Name: string
  Category: string
  OneLiner: string
  TimeSaved: string
  Pricing: string
  AffiliateURL: string
  Discount: string
  Featured: boolean
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
  | "Retain"
  | "Automate"
  | "Scale"
  | "Community"
  | "Support"
  | "SEO"
  | "Distribution"
