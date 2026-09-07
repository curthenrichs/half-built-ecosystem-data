# half-built-ecosystem-data

The list of web properties in the half-built family, served as one JSON
document so every site can render the others without hardcoding them.

Consumed at runtime by the footer island in `@half-built/astro`
(`scripts/ecosystem`). Design record: `2026-09-06-ecosystem-endpoint-design.md`
in the half-built-ui repo.

## The endpoint

`https://ecosystem.half-built-robots.com/ecosystem.json`

Served by a Cloudflare Pages project with no build step, production
branch `main`. `_headers` grants cross-origin reads and sets a five
minute cache with a one day stale-while-revalidate window.

## Schema

Version 1. The wrapper carries `version`, `updated` and `entries`.

| Field | Type | Meaning |
|---|---|---|
| `key` | string | Stable identifier a site matches itself against. Permanent. |
| `label` | string | The rendered text. |
| `href` | string or null | Null means the property exists but is not deployed, and it renders visible and unlinked. |
| `priority` | number | Ascending rank, 0 highest. |
| `family` | string | `half-built` or `adjacent`. Sites sort their own family first. |

Keys are permanent. Renaming a property means a new key, because a site
matching the old key would otherwise vanish from its own footer.

## Changing the list

Edit `ecosystem.json`, run `node validate.mjs`, commit, push. The Pages
project deploys automatically and the change is live within minutes. No
consuming site needs rebuilding.

Adding an entry that no site claims as its own is fine. Removing an
entry that a live site claims is not: that site refuses the whole
document and falls back to its built-in baseline.
