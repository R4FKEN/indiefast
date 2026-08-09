# Reference

## API endpoints

### GET /api/tools

Returns all tools from Airtable.

**Response:**
```json
{
  "tools": [...],
  "source": "airtable" | "cache" | "mock"
}
```

### POST /api/subscribe

Subscribes an email to the newsletter.

**Request:**
```json
{ "email": "user@example.com" }
```

**Response:**
```json
{ "success": true }
```

## Tool data model

```typescript
interface Tool {
  id: string
  Name: string
  Category: string
  SecondCategory: string
  OneLiner: string
  TimeSaved: string
  Pricing: string
  AffiliateURL: string
  Discount: string
  Featured: boolean
  Subtopic: string
}
```

## Dependencies

| Package | Purpose |
|---------|---------|
| react | UI framework |
| @chakra-ui/react | Component library |
| vite | Build tool |
| express | API server |
| @supabase/supabase-js | Newsletter subscriber storage |
| airtable | Airtable client (tools sync) |
| @netlify/functions | Serverless functions |
| concurrently | Run multiple scripts |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| SUPABASE_URL | No | Supabase project URL (newsletter) |
| SUPABASE_SERVICE_ROLE_KEY | No | Supabase service role key (newsletter inserts) |
| AIRTABLE_PAT | No | Airtable personal access token (tools sync) |
| AIRTABLE_BASE_ID | No | Airtable base identifier (tools sync) |
