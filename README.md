# indiefa.st

The curated, hyper-efficient software toolkit for modern builders. Zero bloat. Maximum velocity. Highest discounts.

## Architecture

- **Frontend**: React + Vite + Chakra UI v3
- **Data source**: Airtable (Tools table)
- **Hosting**: Netlify (static build + serverless functions)
- **Analytics**: Ahrefs Web Analytics

## Local Development

1. Copy `.env.example` to `.env` and add your Airtable credentials:
   ```
   AIRTABLE_PAT=your_personal_access_token
   AIRTABLE_BASE_ID=your_base_id
   ```

2. Start the API server (proxies Airtable):
   ```
   npm run server
   ```

3. Start the dev server (in a separate terminal):
   ```
   npm run dev
   ```

The Vite dev server proxies `/api` requests to the Express server on port 3001.

## Production (Netlify)

On deploy, Netlify runs `npm run build` and publishes the `dist/` folder. API routes are handled by Netlify Functions:

- `/api/tools` -> `netlify/functions/tools.ts` (fetches from Airtable)
- `/api/subscribe` -> `netlify/functions/subscribe.ts` (newsletter signup)

Set `AIRTABLE_PAT` and `AIRTABLE_BASE_ID` as environment variables in the Netlify dashboard.

## Features

- Filterable tool grid by implementation stage (Discover -> Grow)
- "Speed Stack" builder: add tools to a personal stack and export as PDF
- Featured tool badges and discount highlights
- Newsletter subscription
- Responsive, neo-brutalist design

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AIRTABLE_PAT` | Airtable Personal Access Token |
| `AIRTABLE_BASE_ID` | Airtable Base ID |
