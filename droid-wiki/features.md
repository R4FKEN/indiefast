# Features

## Tool directory

The core feature is a filterable grid of indie hacker tools.

**Key files:**
- `src/App.tsx` - State management for filters and stack
- `src/components/ToolGrid.tsx` - Grid layout
- `src/components/ToolCard.tsx` - Individual tool display

### Filtering

Users can filter by:
- **Category**: 11 lifecycle stages via `FilterBar.tsx`
- **Subtopic**: 7 growth subtopics when "Grow" is selected

Featured tools always appear first via sort in `App.tsx`.

## Speed Stack

Users can build a collection of tools for comparison:
- Add/remove via toggle button on each card
- Persisted in component state (not localStorage)
- Displayed in `SpeedStack.tsx` floating panel

## Newsletter

Email capture form connected to Supabase `subscribers` table:
- Client-side validation in `Newsletter.tsx`
- Server-side validation in `server.js` and Netlify function (`shared/subscribe-store.mjs`)
- Graceful fallback logs to console when Supabase env is unavailable

## Data caching

Multi-layer caching strategy:
- **Server**: 1-minute cache, 30-second error backoff
- **Client**: sessionStorage with 5-minute TTL
- **Fallback**: Built-in mock data (`src/mock-data.ts`)
