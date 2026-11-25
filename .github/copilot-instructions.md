# IndieFast repository instructions

## Project and commands

IndieFast is a React 19/TypeScript/Vite single-page app for an affiliate-backed indie-maker tool directory. The UI is Chakra UI v3, routing is React Router 7, and the journal content is local Markdown.

```bash
npm install
npm run dev          # Vite on 127.0.0.1:5173 plus Express API on 127.0.0.1:3002
npm run dev:web      # Frontend only
npm run server       # Local API only with nodemon
npm run lint         # ESLint all files
npm run build        # Generates sitemap/LLM files, then builds dist/
npm run build:seo    # Build plus optional static prerender
npm run preview      # Preview existing dist
npm run preview:prod # Build then preview
```

There is no test framework or test script in this repository. For a focused lint check, run `npx eslint <path-to-file>`; for example, `npx eslint src/pages/HomePage.tsx`.

The default build first regenerates `public/sitemap.xml`, `public/llms.txt`, `public/llms-full.txt`, `public/llms-full.md`, `public/ai.txt`, `public/.well-known/ai.txt`, and `public/robots.txt`. Review generated changes after catalog or blog edits.

## Architecture and data flow

- `src/App.tsx` owns the route table and lazy-loads Home, Blog, BlogPost, and the development-only Admin page. `src/components/AppLayout.tsx` wraps every route.
- `src/pages/HomePage.tsx` loads the tool catalog and owns active category, Grow subtopic, and Speed Stack selection state. Filtering and sorting are derived locally.
- Tools come from `public/tools.json` through `src/api.ts`; the browser must not receive an inlined copy or fall back to an API snapshot. Keep `Tool` in `src/types.ts` synchronized with catalog edits.
- `/api/subscribe` is implemented by `server.js` locally and `netlify/functions/subscribe.ts` in production. Both use `shared/subscribe-store.mjs`.
- `/api/tools` and the Netlify tools function expose catalog snapshots, but the normal frontend path is the static `/tools.json` asset.
- Blog routes use `src/content/blog/*.md` loaded by `import.meta.glob` in `src/data/blog-posts.ts`; frontmatter parsing and FAQ JSON-LD extraction are in `src/utils/blog.ts`.
- `src/constants/site-copy.ts` is the source of truth for the canonical tagline, supporting copy, description, and OG image.
- `src/constants.ts` and `src/types.ts` define category colors and the category/Subtopic unions. `11. Grow` subtopics are parallel filters, not ordered journey stages.
- `jspdf` is intentionally loaded dynamically in `src/utils/exportPdf.ts` and only for Speed Stack PDF export.

## Repository conventions

- The catalog is `public/tools.json`. Add logos under `public/tool-logos/` and set `LogoUrl` to the public path. Preserve existing `rec...` IDs; use short slugs for new tools. Affiliate URLs must include existing affiliate and UTM parameters exactly as supplied.
- Category values are the numbered strings `1. Discover` through `11. Grow`; `Subtopic` is only used for `11. Grow` and uses `Automate`, `Scale`, `Community`, `Support`, `SEO`, or `Distribution`. `SecondCategory` is optional and participates in filtering.
- `Featured` controls the popular badge and category ordering. In category views, featured tools sort before non-featured tools; All view sorts alphabetically.
- The local-only admin route is `/admin` and appears only in development. It writes `public/tools.json` and uploaded logos through loopback-restricted `/api/admin/*` endpoints in `server.js`; do not expose or enable it in production.
- Keep Supabase credentials server-only. `.env` may define `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; never add `VITE_*` secrets. Without credentials, newsletter insertion intentionally uses the mock success path.
- The Netlify deploy publishes `dist/` and maps `/api/tools` and `/api/subscribe` to functions in `netlify.toml`.
- Use the `@/*` alias for imports from `src`.
- Preserve the site copy and category taxonomy across UI, blog frontmatter, catalog fields, sitemap generation, and LLM corpus generation. Adding or renaming a blog post requires keeping the filename, frontmatter slug, `PUBLISHED_AT` maps in blog/scripts, and canonical URL aligned.
- Chakra component styling in this codebase uses deliberate hard borders, compact border radius, and offset shadows. Reuse existing UI primitives and constants rather than introducing a different visual system.

## Working constraints

- Never use git worktrees. Work only in `C:\Users\rafva\Documents\GitHub\indiefast` on the current branch.
- Do not commit `.env` or service-role credentials.
