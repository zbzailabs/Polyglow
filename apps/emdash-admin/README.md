# Polyglow EmDash Admin

Standalone EmDash CMS backend for Polyglow. It is deployed separately from the
root Worker/static site and runs on Dokploy at `crm-polyglow.realrip.com`.

## What's Included

- Posts with category and tag archives
- Static pages via slug routing
- Seed data with demo content
- Minimal layout and styling

## Pages

| Page | Route |
|---|---|
| Homepage | `/` |
| All posts | `/posts` |
| Single post | `/posts/:slug` |
| Category archive | `/category/:slug` |
| Tag archive | `/tag/:slug` |
| Static pages | `/:slug` |
| 404 | fallback |

## Infrastructure

- **Runtime:** Node.js
- **Database:** SQLite (local file)
- **Storage:** Local filesystem
- **Framework:** Astro with `@astrojs/node`

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321 for the site and http://localhost:4321/_emdash/admin for the CMS.

## Production

The Docker image runs:

```bash
node ./dist/server/entry.mjs
```

Use these environment variables in Dokploy:

- `HOST=0.0.0.0`
- `PORT=4321`
- `DATABASE_PATH=/app/data/emdash.db`
- `UPLOADS_DIR=/app/data/uploads`
- `PUBLIC_SITE_URL=https://crm-polyglow.realrip.com`
- `EMDASH_ENCRYPTION_KEY=<generated secret>`

Mount `/app/data` as persistent storage.

On first boot, check `/_emdash/admin/setup`; after setup, the root path redirects
to `/_emdash/admin`.
