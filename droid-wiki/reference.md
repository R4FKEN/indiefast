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
| airtable | Airtable client |
| @netlify/functions | Serverless functions |
| concurrently | Run multiple scripts |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| AIRTABLE_PAT | No | Airtable personal access token |
| AIRTABLE_BASE_ID | No | Airtable base identifier |
