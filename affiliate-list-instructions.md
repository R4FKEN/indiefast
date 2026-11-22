# Affiliate list instructions

The affiliate catalog is the `tools` array in [`public/tools.json`](public/tools.json). Logos are files in [`public/tool-logos/`](public/tool-logos/). You can edit those files by hand, or use the local admin page described below. There is no admin on the live site.

The homepage loads `/tools.json` in the browser. In local dev (`npm run dev`) a refresh is enough to see a change. A production deploy needs a build: `npm run build` copies `public/` into the site and regenerates `llms.txt` and `llms-full.md` from this same file.

Do not rename existing `rec…` ids. Logo files are named after those ids. New tools get a short slug instead.

## Admin page on this machine

With `npm run dev` running, open [http://127.0.0.1:5173/admin](http://127.0.0.1:5173/admin).

- The list is every tool. **New tool** starts a blank form. **Save** writes `public/tools.json` and, if you chose an image, `public/tool-logos/{id}.{ext}`.
- **Remove** deletes that tool and its logo file after you confirm.
- The page is not included in the production site. The save API only accepts requests from this computer.
- Refresh the homepage to see the change. Commit `public/tools.json` and any new or deleted logo before you deploy. `npm run build` still regenerates the LLM files.

## File shape

`public/tools.json` looks like this:

```json
{
  "source": "local",
  "generatedAt": "2026-07-11T18:20:52.330Z",
  "tools": [
    {
      "id": "beehiiv",
      "Name": "Beehiiv",
      "Category": "9. Monetize",
      "SecondCategory": "",
      "OneLiner": "Newsletter platform for indie makers.",
      "Reasoning": "One place for sending, the site, and paid subscriptions, instead of stitching three tools together.",
      "TimeSaved": "5hr / month",
      "Pricing": "Free tier / $42/mo",
      "AffiliateURL": "https://www.beehiiv.com?via=example",
      "Discount": "14 days free, 20% OFF for 3 months!",
      "Featured": false,
      "Subtopic": "",
      "LogoUrl": "/tool-logos/beehiiv.png"
    }
  ]
}
```

Keep `"source": "local"`. `generatedAt` is a label only; the site does not read it. Update it when you want a record of the last edit. The site only requires that `tools` is an array.

The file is JSON, not a loose list:

- Strings use double quotes.
- `Featured` is `true` or `false`, not `"true"`.
- No trailing comma after the last property or the last tool.
- Escape quotes inside text as `\"`.
- Every tool needs a unique `id`.

## Attributes

| Field | Required | What it does |
| --- | --- | --- |
| `id` | Yes | Unique key. Also the logo filename. Existing tools keep their `rec…` id. New tools use a lowercase slug: letters, numbers, hyphens (`plausible`, `chrome-goldmine`). Do not use spaces. |
| `Name` | Yes | Card title and PDF name. On the **All** filter, cards are sorted A→Z by this field. |
| `Category` | Yes | Primary stage. Must be one of the values below, including the number and period. This is the filled color chip on the card. |
| `SecondCategory` | Yes, use `""` if none | Optional second stage, same allowed values as `Category`. The tool then shows up in both filters. Leave `""` when there is only one stage. Do not put `"All"` here. |
| `OneLiner` | Yes | Short description. The card uses it only when `Reasoning` is empty. It is always included in the generated LLM files. |
| `Reasoning` | Yes, use `""` if none | Body copy on the card (about four lines, then it truncates) and in the Speed Stack PDF. Prefer this over `OneLiner` for what a solo founder actually saves. |
| `TimeSaved` | Yes | Shown as `Saves {TimeSaved}` on the card. The PDF adds up hours by reading the first number followed by `h` or `hr` (for example `15hr / month` or `40hr`). Phrases with no hour number, such as `2 weeks`, count as zero hours in that total. |
| `Pricing` | Yes | Not shown on the card. Included in `llms-full.md` after the next build. Examples already in the file: `Free tier / $49/mo`, `$99 one-time`, `Free`. |
| `AffiliateURL` | Yes | The **Get Tool** link. Use a full `https://` URL, including the affiliate code already on it. Do not add UTM params. |
| `Discount` | Yes, use `""` if none | Red badge on the card. `""` hides the badge. Write the offer the visitor gets (`20% OFF via this link!`), not an internal note. |
| `Featured` | Yes | `true` adds the yellow **POPULAR** badge. Inside a single category filter, featured tools are listed first. **All** stays alphabetical and ignores this flag. More than one tool in a category may be featured. |
| `Subtopic` | Yes, use `""` if none | Grow track. Only matters when the tool appears under **11. Grow** (as `Category` or `SecondCategory`). Allowed values are below. `""` means it shows on Grow → All, and is hidden when a specific track is selected. |
| `LogoUrl` | Yes | Public path, always starting with `/tool-logos/`. Must match the file you add. If it is missing or the file 404s, the card shows the first letter of `Name` instead. |

### Category values

Copy one of these exactly:

- `1. Discover`
- `2. Research`
- `3. Validate`
- `4. Plan`
- `5. Design`
- `6. Build`
- `7. Backend`
- `8. Ship`
- `9. Monetize`
- `10. Measure`
- `11. Grow`

### Grow subtopics

Use one of these only when the tool belongs to Grow. Otherwise set `Subtopic` to `""`.

- `Automate`
- `Scale`
- `Community`
- `Support`
- `SEO`
- `Distribution`

These are parallel tracks, not steps. A Grow tool should have one subtopic so it can be filtered. A non-Grow tool that also lists `11. Grow` as `SecondCategory` should still set `Subtopic`, or it will only appear on Grow → All.

## Add an affiliate

1. Pick an `id` slug that is not already in `tools` or in `public/tool-logos/`.
2. Save the logo as `public/tool-logos/{id}.png`. PNG is the usual format. `.jpg`, `.jpeg`, `.webp`, and `.gif` also work if `LogoUrl` uses that same extension. A square image around 256×256 is enough; the card draws it at 36×36.
3. Open `public/tools.json`.
4. Add a new object inside the `tools` array. Put a comma after the previous tool. Do not leave a comma after the last one.
5. Fill every field in the table above. Use `""` for `SecondCategory`, `Discount`, or `Subtopic` when they do not apply. Use `false` for `Featured` unless this should be a popular pick.
6. Set `LogoUrl` to `/tool-logos/{id}.png` (or the extension you used).
7. Set `AffiliateURL` to the full affiliate link. Do not add UTM params.
8. Refresh the local site (`npm run dev`, then http://127.0.0.1:5173/). Check the card, the category filter, the **Get Tool** link, and the logo.
9. Commit both `public/tools.json` and the new logo file.

On **All**, the new name is sorted alphabetically. Inside its category, it stays in file order unless `Featured` is `true`, in which case it moves ahead of non-featured tools.

## Change an affiliate

Edit the object in place. Keep `id` the same.

- Changing `Name`, copy, pricing, discount, category, or the affiliate URL is only a JSON edit.
- Replacing a logo: overwrite `public/tool-logos/{id}.png`, or save a new file and point `LogoUrl` at it. Delete the old file if you change the extension. Browsers may cache the old image; a hard refresh checks the new one.
- Changing `id` means renaming the logo file and updating `LogoUrl` in the same change. Avoid that for existing `rec…` ids.

## Remove an affiliate

1. Delete that object from the `tools` array, including its comma, so the JSON still parses.
2. Delete its logo from `public/tool-logos/`. The filename starts with the tool `id` (`recRVasXXLd0NAYiZ.png`, `beehiiv.png`).
3. Do not delete a logo that another tool's `LogoUrl` still points at.
4. Refresh the site and confirm the card is gone from **All** and from its category.
5. Commit the JSON change and the logo deletion.

Removing a tool does not edit blog posts. If a guide names that product, update the matching file under `src/content/blog/` separately.

## After you edit

- Local preview reads `public/tools.json` directly. No sync command.
- `npm run build` rewrites `public/llms.txt`, `public/llms-full.txt`, and `public/llms-full.md` from the catalog. Run it before a deploy if those pages should mention the new link, price, or reasoning.
- If the homepage is empty, the JSON is invalid or `tools` is not an array. Paste the file into a JSON checker and fix the comma or quote it points at.
