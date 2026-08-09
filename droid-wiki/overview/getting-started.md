# Getting started

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project (optional for newsletter; mock signup works without it)
- Airtable account (optional; only for refreshing tools via `npm run sync:tools`)

## Installation

```bash
git clone https://github.com/R4FKEN/indiefast.git
cd indiefast
npm install
```

## Environment variables

Create a `.env` file in the project root (see `.env.example`):

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AIRTABLE_PAT=your_personal_access_token
AIRTABLE_BASE_ID=your_base_id
```

Without Supabase credentials, newsletter signups return a mock success. Without Airtable credentials, tools still load from `public/tools.json`.

## Running locally

**Frontend only:**
```bash
npm run dev
```

**Frontend + Express server:**
```bash
npm run server  # In one terminal
npm run dev     # In another terminal
```

## Building for production

```bash
npm run build
npm run preview  # Test production build
```

## Deploying to Netlify

1. Push to GitHub
2. Connect repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

## Linting

```bash
npm run lint
```
