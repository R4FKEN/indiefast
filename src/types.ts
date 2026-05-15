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
  | "Starter Kits"
  | "Rapid UI"
  | "Plug-and-Play Backend"
  | "Instant Payments"
  | "AI Code Gen"
  | "Growth Engines"
