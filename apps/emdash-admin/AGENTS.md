# Polyglow EmDash Admin Agent Guide

This package is the standalone EmDash CMS backend for Polyglow. Keep it
separate from the root Astro Worker/static site so the existing Worker release
path remains unchanged.

## Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Typecheck: `pnpm typecheck`
- Build: `pnpm build`
- Run built server: `pnpm start`

## Deployment

- Runtime target: Node.js 24 on Dokploy.
- Production command: `node ./dist/server/entry.mjs`
- Container port: `4321`
- First-boot readiness check: `/_emdash/admin/setup`
- Persistent data directory: `/app/data`
- SQLite database: `/app/data/emdash.db`
- Local uploads: `/app/data/uploads`

## Documentation

Look up EmDash documentation through the `emdash-docs` MCP server when verifying
an API, hook, config option, or implementation pattern. Prefer the docs MCP over
assumptions from training data because it reflects current published behavior.

## Rules

- Do not change the root Polyglow Worker/static deployment config from this
  package.
- Keep secrets out of git. Use Dokploy environment variables for production
  values such as `EMDASH_ENCRYPTION_KEY`.
- Keep the EmDash database and uploads on a Dokploy persistent mount.
