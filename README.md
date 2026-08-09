# IndieFast (indiefa.st)

A curated toolkit for indie makers — **one vetted tool per stage** of the full founder journey, from idea to scale.

## Positioning

### Differentiator

Competitors like Indie Hackers' directory and vibecoding.app are scoped to **coding tools only** (IDEs, AI agents). IndieFast covers the **entire founder journey** — Discover through Grow — not just build. That is a categorically different product, not a better-curated version of the same thing. **Lead with the journey, not speed or discounts alone.**

### Copy (canonical)

| Use | Text |
|-----|------|
| **Hero tagline** | Every step from idea to scale. One tool each. |
| **Supporting line** | Discover, validate, build, ship, and grow — a hand-picked tool for every stage of the indie maker journey. No more piecing together advice from ten different Twitter threads. |
| **Meta / OG / Twitter description (≤160)** | Discover, validate, build, ship, and grow — a hand-picked tool for every stage of the indie maker journey. |
| **Page title** | indiefa.st — Every step from idea to scale. One tool each. |

Source of truth in code: `src/constants/site-copy.ts`

### Category structure

The first 10 categories (Discover → Measure) plus **Grow** read as a **sequence** — one stage leads to the next.

**Grow's subcategories** (Automate, Scale, Community, Support, SEO, Distribution) are **not sequential**. They are parallel functions you run simultaneously once you're growing. The UI should show:

- Main 11 categories as a horizontal path / timeline
- Grow expands into a **separate cluster** of 6 sub-filters (not a continuation of the same line)

Rendering them as one flat sequence implies an order (e.g. Community after SEO) that does not exist.

### SEO content plan

Each of the 11 categories (and the 6 Grow subcategories) can become its own landing page — e.g. "Best tool to validate your MVP idea," "Best tool to monetize your indie SaaS" — each targeting its own keyword cluster, all linking back to the main toolkit. Stronger than one homepage trying to rank for "indie maker tools."

## Development

```bash
npm install
npm run dev          # API (port 3002) + hot-reload preview (port 5173)
npm run sync:tools   # Re-import Airtable → public/tools.json + logos
npm run build        # Sync + production build
npm run preview:prod # Build + serve dist on port 4173
```

Requires `.env` (see `.env.example`):
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` for newsletter signup
- `AIRTABLE_PAT` + `AIRTABLE_BASE_ID` for tools sync (`npm run sync:tools`)

## Stack

React + TypeScript + Vite, Chakra UI, Express API (local dev), Netlify Functions (production).