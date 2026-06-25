/**
 * Airtable "Tools" table column names.
 *
 * AFFILIATE LINKS: always read the "URL" column — never "AffiliateURL".
 * "URL" is the full outbound link (affiliate + UTM params).
 * "AffiliateURL" in Airtable is the base link only and must not be used.
 */
export const AIRTABLE_TOOL_FIELDS = {
  name: "Name",
  category: "Category",
  secondCategory: "SecondCategory",
  oneLiner: "OneLiner",
  reasoning: "Reasoning",
  timeSaved: "TimeSaved",
  pricing: "Pricing",
  /** Outbound link — Airtable column is "URL", stored as Tool.AffiliateURL */
  affiliateUrl: "URL",
  discount: "Discount",
  featured: "Featured",
  subtopic: "Subtopic",
  logo: "Logo",
} as const