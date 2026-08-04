# SEO Deployment Guide for IndieFast

## Overview
This repo is now configured for SEO-friendly static deployment:
- Base page metadata is defined in `index.html`
- Blog routes use `react-helmet-async` for route-specific metadata
- `scripts/generate-sitemap.mjs` creates `public/sitemap.xml`
- `scripts/prerender.mjs` prerenders routes from the sitemap into `dist` (optional SEO step)
- Default `npm run build` is bolt.new / CI safe (no Puppeteer). Use `npm run build:seo` when Chromium is available.
- Netlify functions remain available for `/api/subscribe` and `/api/tools`

---

## Updated build workflow

### New scripts
- `npm run generate:sitemap`
- `npm run generate:llms`
- `npm run prerender` (requires `npm i -D puppeteer` first — not in default deps so bolt.new/CI stay light)
- `npm run build` runs:
  1. `npm run generate:sitemap`
  2. `npm run generate:llms`
  3. `vite build`
- `npm run build:seo` runs `build` then `prerender`

### What prerendering does
- Launches a local server serving `dist`
- Uses Puppeteer to render each route from `public/sitemap.xml`
- Writes static HTML for each route into `dist`
- Ensures blog pages have prerendered content and metadata for crawlers

---

## Vite prerender details

### Why this implementation
- `vite-plugin-prerender` was incompatible with the repo's ESM setup
- A custom script is safer and fully controlled
- Routes are derived from the sitemap
- This keeps the app as a React SPA in production, while providing prerendered HTML for SEO

### How to add new prerendered pages
1. Add the route to the sitemap generator in `scripts/generate-sitemap.mjs`
2. Ensure the route is included in `public/sitemap.xml`
3. Add your page component and route metadata
4. Run `npm run build`

---

## Netlify deployment instructions

### 1. Connect repo
1. Create or log into your Netlify account.
2. Create a new site from GitHub.
3. Select this repository.

### 2. Set build settings
- Build command: `npm run build`
- Publish directory: `dist`

### 3. Add environment variables (optional)
If you want live Airtable newsletter signup support, add the following:
- `AIRTABLE_PAT`
- `AIRTABLE_BASE_ID`

### 4. Confirm functions
Netlify will deploy functions from `netlify/functions` automatically.
The site already has redirects in `netlify.toml` for:
- `/api/tools` ΓåÆ `/.netlify/functions/tools`
- `/api/subscribe` ΓåÆ `/.netlify/functions/subscribe`

### 5. Enforce HTTPS
Use Netlify-managed HTTPS for the site.

---

## Cloudflare DNS setup

### 1. Add your domain
1. Add the domain in Cloudflare.
2. Set Cloudflare name servers on your registrar.

### 2. Configure DNS records
Use DNS-only mode for the Netlify records:

- `CNAME www` ΓåÆ `<your-site>.netlify.app`
- Root record:
  - If Cloudflare supports CNAME flattening: `CNAME @` ΓåÆ `<your-site>.netlify.app`
  - Otherwise, use Netlify-provided A records.

### 3. Set SSL/TLS mode
- Prefer `Full` or `Full (strict)`
- Keep Cloudflare proxy disabled for Netlify-managed certs if you want the cleanest setup

### 4. Canonical domain
- Choose `www` or naked root as canonical.
- Use Netlify or Cloudflare page rules to redirect the non-canonical domain if needed.

---

## Verification
1. Run locally: `npm run dev`
2. Build locally: `npm run build`
3. Check generated files:
   - `dist/index.html`
   - `dist/blog/<slug>/index.html`
   - `dist/sitemap.xml`
4. Confirm pages have prerendered HTML and metadata in the output.

---

## Notes
- The current bundle contains large chunks; consider future code splitting if page speed becomes an issue.
- `public/sitemap.xml` is now generated automatically, so keep blog metadata and route definitions in sync.
