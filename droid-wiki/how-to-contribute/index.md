# How to contribute

## Development workflow

1. Create a feature branch from `main`
2. Make changes following the coding conventions
3. Run `npm run lint` to check for issues
4. Test locally with both mock data and Airtable
5. Submit a pull request

## Code style

- TypeScript strict mode
- Functional React components with hooks
- Chakra UI for styling (neobrutalist design system)
- Named exports for components

## Adding a new component

1. Create file in `src/components/`
2. Export from the file with named export
3. Import in `App.tsx` or parent component
4. Follow existing patterns (see `ToolCard.tsx` for reference)

## Testing changes

The app gracefully degrades when Airtable is unavailable:
- Remove env vars to test with mock data
- Check both filtered and unfiltered views
- Test Speed Stack add/remove functionality
- Verify newsletter form validation
