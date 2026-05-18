# Contributing

Thanks for helping improve Polyglow.

## Development setup

Requirements:

- Node.js 24
- pnpm 11

Install dependencies and start the local site:

```bash
pnpm install
pnpm dev
```

## Project boundaries

Polyglow V1 is a static multilingual content site. Keep changes within these boundaries unless an issue explicitly expands the scope:

- Astro renders layouts, content pages, SEO, RSS, sitemap, pagination, and image wrappers.
- Astro components and small inline scripts handle focused interaction such as theme switching, language switching, mobile navigation, search, and Astro view transitions.
- The build remains static-first and deployable to Cloudflare Pages or Wrangler static assets.
- R2 is optional. Local assets and other approved remote image hosts remain supported.

## Before opening a pull request

Run the standard checks:

```bash
pnpm lint
pnpm assets:check
pnpm check
pnpm test:e2e
```

For UI changes, update Playwright visual snapshots only after reviewing the rendered page in desktop and mobile viewports.

## Content changes

- Place posts under `src/content/posts/{locale}/`.
- Keep frontmatter compatible with `src/content.config.ts`.
- Provide descriptive image alt text.
- Remote `heroImage` values need explicit width and height.
- Do not commit draft content unless the issue asks for it.

## Pull request style

- Keep the pull request scoped to one feature or fix.
- Explain the visible behavior change.
- List verification commands and any known residual warnings.
