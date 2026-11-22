---
name: replace-affiliate-list
description: >
  Replace the whole IndieFast affiliate catalog and logos in one pass:
  public/tools.json and public/tool-logos/. Use when the user wants to change,
  replace, or swap the entire affiliate list, all tools, or all logos at once,
  or runs /replace-affiliate-list. Not for editing one tool.
---

# Replace the affiliate list

Replace the catalog in one write. The site reads `public/tools.json`. Logos live in `public/tool-logos/`. There is no Airtable sync.

## Read before writing

- `affiliate-list-instructions.md` — field meaning, exact category and Grow-subtopic strings, and what the card, filters, and PDF do with each field.
- `public/tools.json` and the filenames in `public/tool-logos/`.
- `shared/admin-catalog.mjs` — `normalizeTools` and `saveCatalog`. Do not invent a second set of validation rules.

## What the new list is

Treat the user's list as the full catalog only when they ask to replace, swap, or change the entire list. Tools absent from that list are removals.

If the new list is much shorter than the current catalog and they did not say to delete the rest, stop and ask. Do not delete the rest on a guess.

A partial edit (one tool, a few fields) is not a full replace. Change only those rows and leave every other tool and logo as they are.

## Map each row

Match an incoming row to an existing tool by `id` if one was given, otherwise by `Name` with case and surrounding space ignored.

- Keep an existing `rec…` id. Do not rename it.
- A new tool gets a new lowercase slug: letters, numbers, hyphens (`beehiiv`, `chrome-goldmine`). It must not match an id already in the file or in this batch.
- Copy every field in the order `saveCatalog` writes: `id`, `Name`, `Category`, `SecondCategory`, `OneLiner`, `Reasoning`, `TimeSaved`, `Pricing`, `AffiliateURL`, `Discount`, `Featured`, `Subtopic`, `LogoUrl`.
- Use `""` for an empty second category, discount, reasoning, or subtopic. `Featured` is a boolean.
- Category and subtopic strings must match `affiliate-list-instructions.md` exactly, including the number and period. Map loose labels (`Grow`, `SEO`) onto those strings. If a row does not fit one stage, ask instead of picking one.
- `SecondCategory` is `""` or a different stage from `Category`.
- Set `Subtopic` only from the six Grow tracks, and only when the tool is in Grow as category or second category. Otherwise `""`.
- Keep the affiliate code already on a URL. Add `utm_source=indiefast`, `utm_medium=website`, and `utm_campaign=frontpage` when they are missing. Do not invent a URL or a discount. List any row that has no affiliate URL and stop before writing.
- `TimeSaved` should include an hour number plus `h` or `hr` when the user means hours (`15hr / month`). The PDF total ignores phrases with no hour number.

## Logos

Accept a file path, an attached image, or a direct image URL. png, jpeg, webp, or gif, under 1.5MB.

- Save it as `public/tool-logos/{id}.{ext}` and set `LogoUrl` to `/tool-logos/{id}.{ext}`.
- A matched tool with no new image keeps its current logo file and `LogoUrl`.
- A new tool with no image gets `LogoUrl: ""`. The card shows the first letter. Say which tools those are.
- Do not delete the previous logo file yourself. `saveCatalog` removes a `{id}.*` file after the JSON write when that tool is gone or the extension changed, and only if nothing still references it.

## Write once

Validate with `normalizeTools` before copying any new logo into `public/tool-logos/`. Then copy the new logo files. Then call `saveCatalog` a single time with the full `tools` array and no `logo` argument (the files are already named). On Windows, import the module with `pathToFileURL`.

Put the script in the temp directory, not in the repo. Delete it when the save finishes.

```js
import { pathToFileURL } from "node:url"
import path from "node:path"

const repo = "C:/Users/rafva/Documents/GitHub/indiefast"
const { normalizeTools, saveCatalog } = await import(
  pathToFileURL(path.join(repo, "shared/admin-catalog.mjs")).href
)

const tools = normalizeTools([/* full next catalog */])
const saved = await saveCatalog(repo, { tools })
console.log(saved.tools.length)
```

If `normalizeTools` or `saveCatalog` throws, change the data and run it again. Do not hand-edit `public/tools.json` after a failed save. If logos were copied and the save then throws, delete only the logo files added in this run that the previous catalog does not reference.

`saveCatalog` sets `source` to `local`, refreshes `generatedAt`, and keeps the file's existing newline. Do not write a second copy of the catalog through the admin page.

## Leave alone

- Do not commit, push, or deploy.
- Do not run `npm run build` unless the user wants `llms.txt` and `llms-full.md` regenerated.
- Do not edit blog posts. If a removed tool is named in `src/content/blog/`, list those files and stop.
- Do not add a link to `/admin` on the public site.

## Check

- The saved tool count matches the new list, and every id is unique.
- Spot-check three tools: name, category, affiliate URL, discount, and logo path.
- If `npm run dev` is running, open http://127.0.0.1:5173/ and confirm those three cards, their category filters, the logo, and the Get Tool link. A refresh is enough. Saving `public/` does not restart the API.
- Report what was added, updated, and removed, plus any tool left without a logo.
