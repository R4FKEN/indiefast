import { AIRTABLE_TOOL_FIELDS as F } from "./airtable-fields.mjs"
import { resolveLogoUrl } from "./logo-utils.mjs"

export async function mapAirtableRecord(record, options = {}) {
  const LogoUrl = await resolveLogoUrl(record, options)

  return {
    id: record.id,
    Name: record.get(F.name) || "",
    Category: record.get(F.category) || "",
    SecondCategory: record.get(F.secondCategory) || "",
    OneLiner: record.get(F.oneLiner) || "",
    Reasoning: record.get(F.reasoning) || "",
    TimeSaved: record.get(F.timeSaved) || "",
    Pricing: record.get(F.pricing) || "",
    AffiliateURL: record.get(F.affiliateUrl) || "",
    Discount: record.get(F.discount) || "",
    Featured: record.get(F.featured) || false,
    Subtopic: record.get(F.subtopic) || "",
    LogoUrl,
  }
}

export async function mapAirtableRecords(records, options = {}) {
  return Promise.all(records.map((record) => mapAirtableRecord(record, options)))
}