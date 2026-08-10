# IndieFast (indiefa.st)

Curated toolkit for indie makers — **one vetted tool per stage** of the founder journey, from idea to scale.

**Live site:** [https://indiefa.st](https://indiefa.st)

## What it is

- **Homepage directory** — tools filtered by journey stage (Discover → Grow), with featured picks and optional second categories
- **Speed Stack** — pick tools into a personal stack and export a PDF cheat sheet
- **Blog** — stage guides (and Grow subtopics) with SEO frontmatter, FAQ schema, and route metadata
- **Newsletter** — “Follow the path” email capture stored in **Supabase**
- **SEO / LLM surfaces** — sitemap, robots, Open Graph image, `llms.txt` + full tool corpus

### Differentiator

Many directories focus on **coding tools only**. IndieFast maps the **full journey** (Discover through Grow), not just build. Lead with the path; speed and discounts are secondary.

### Category structure

| Sequence (main path) | Parallel Grow tracks |
|----------------------|----------------------|
| 1. Discover → 10. Measure → 11. Grow | Automate, Scale, Community, Support, SEO, Distribution |

Grow sub-filters are **not** ordered steps — they run in parallel once you are growing.

## Canonical copy

| Use | Text |
|-----|------|
| **Hero tagline** | Every step from idea to scale. One tool each. |
| **Supporting line (UI)** | Discover, validate, build, ship, and grow — a hand-picked tool for every stage of the indie maker journey. No more piecing together advice from ten different Twitter threads. |
| **Meta / OG / Twitter (≤160)** | Discover, validate, build, ship, and grow — a hand-picked tool for every stage of the indie maker journey. |
| **Page title** | indiefa.st — Every step from idea to scale. One tool each. |
| **OG image** | `https://indiefa.st/og-image.webp` (`public/og-image.webp`) |

Source of truth: [`src/constants/site-copy.ts`](src/constants/site-copy.ts)

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite, Chakra UI, React Router, react-helmet-async |
| Local API | Express (`server.js`) on port 3002 |
| Production API | Netlify Functions (`netlify/functions/`) |
| Newsletter | Supabase `subscribers` table via service role ([`shared/subscribe-store.mjs`](shared/subscribe-store.mjs)) |
| Tools catalog | Committed snapshot [`public/tools.json`](public/tools.json); refresh from **Airtable** with `npm run sync:tools` |
| Deploy | Netlify (`netlify.toml` → publish `dist`) |

## Architecture (data flow)

```text
Browser
  ├─ tools     → public/tools.json (prod bundle / static) or snapshot in dev
  └─ subscribe → POST /api/subscribe
                   ├─ local:  Express server.js
                   └─ prod:   Netlify function subscribe.ts
                              └─ Supabase subscribers (service role)

npm run sync:tools → Airtable → public/tools.json + public/tool-logos/
```

Airtable is **not** used for newsletter signups. Without Supabase env vars, subscribe returns a mock success (local-friendly).

## Development

```bash
npm install
cp .env.example .env   # fill in secrets (see below)

npm run dev            # API :3002 + Vite :5173
npm run sync:tools     # Airtable → public/tools.json + logos
npm run build          # sitemap + llms + vite build → dist/
npm run build:seo      # build + optional Puppeteer prerender (needs puppeteer)
npm run preview        # serve existing dist
npm run preview:prod   # build then preview
npm run lint
```

### Environment variables

See [`.env.example`](.env.example). Never commit `.env` or use `VITE_*` for secrets.

| Variable | Required for | Notes |
|----------|--------------|--------|
| `SUPABASE_URL` | Live newsletter | Project URL only (no `/rest/v1/`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Live newsletter | Server-only; Netlify env + local `.env` |
| `AIRTABLE_PAT` | Tools sync | `npm run sync:tools` only |
| `AIRTABLE_BASE_ID` | Tools sync | `npm run sync:tools` only |

Supabase schema: [`supabase/migrations/20260808_subscribers.sql`](supabase/migrations/20260808_subscribers.sql) (run in the SQL editor once).

### Scripts (more detail)

| Script | What it does |
|--------|----------------|
| `generate:sitemap` | Writes `public/sitemap.xml` (incl. OG image entries) |
| `generate:llms` | Writes `public/llms.txt`, `llms-full.txt`, `llms-full.md` |
| `prerender` | Optional static HTML per sitemap route (Puppeteer; not in default deps) |
| `export-tools` / `sync:tools` | Airtable → tools snapshot + logos |

SEO / Netlify notes: [`SEO-DEPLOYMENT.md`](SEO-DEPLOYMENT.md)

## Project layout (high level)

```text
src/                 React app (pages, components, blog content)
public/              Static assets, tools.json, SEO/LLM files, og-image.webp
netlify/functions/   subscribe (Supabase), tools (snapshot)
shared/              subscribe-store, Airtable sync helpers
scripts/             sitemap, llms, tools export, prerender
supabase/migrations/ subscribers table SQL
server.js            Local Express API
AGENTS.md            Agent rules (no git worktrees; Documents checkout only)
```

## Deploy (Netlify)

1. Build command: `npm run build` · publish directory: `dist`
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the site for production signups
3. Redirects already map `/api/subscribe` and `/api/tools` to functions

## Contributing / agents

- Product wiki notes live under [`droid-wiki/`](droid-wiki/)
- **Do not use git worktrees** on this project. Work only in the main local checkout (see [`AGENTS.md`](AGENTS.md))
