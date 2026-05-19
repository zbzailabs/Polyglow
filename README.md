# Polyglow

[中文说明](readme-zh.md)

Polyglow is a static Astro blog theme for multilingual writing.

It includes locale routes, content collections, categories, tags, author pages, search, RSS, sitemap, SEO metadata, optimized images, light/dark themes, and static deployment output.

## Start

Requirements:

- Node.js 24 or newer
- pnpm 11

```bash
pnpm install
pnpm dev
```

Astro prints the local URL, usually:

```text
http://localhost:4321/en/
```

## Commands

```bash
pnpm dev        # Start local development
pnpm build      # Build the static site
pnpm preview    # Preview the built site locally
pnpm deploy     # Build and deploy to Cloudflare with Wrangler
```

## Write Content

Content lives in `src/content`:

```text
src/content/
  authors/
  pages/
  posts/
```

Posts use locale folders:

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

Post frontmatter:

```yaml
---
title: "Post title"
description: "Short summary for cards and metadata."
category: "build"
tags: ["strategy"]
pubDate: 2026-05-12
updatedDate: 2026-05-12
authors: ["default"]
heroImage: "/open-graph.webp"
heroImageAlt: "Descriptive image alternative text"
locale: "en"
slug: "my-post"
draft: false
featured: false
---
```

Remote `heroImage` values must include `heroImageWidth` and `heroImageHeight`.

## Configure

Common files:

```text
src/config/site.ts       # Site name, URL, repository, homepage layout
src/config/locales.ts    # Locales and text direction
src/config/taxonomy.ts   # Categories and tags
src/i18n/*.json          # Interface text
```

Configured locales:

```text
zh en fr es ru ja ko pt de id ar
```

Homepage layouts in `src/config/site.ts`:

- `cover`: image-led homepage.
- `archive`: compact archive-first homepage.
- `text`: text-card homepage for low-image publishing.

## Deploy

The build output is `dist`.

```bash
pnpm build
```

Polyglow can be published to any static host, including Cloudflare Pages, Vercel,
Netlify, GitHub Pages, or a plain web server. Page views are disabled by default,
so non-Cloudflare platforms do not need any database or serverless function.

Polyglow also includes an optional Cloudflare Workers deployment path:

```bash
pnpm deploy
```

### Optional Page Views

The page view counter is an optional Cloudflare D1 feature. It is disabled unless
`PUBLIC_PAGE_VIEWS_ENABLED=true` is set at build time and in the Worker runtime.

When disabled:

- No page view UI is rendered.
- No browser request is made to `/api/page-view`.
- Static hosts such as Vercel, Netlify, GitHub Pages, and plain CDN hosting work
  without extra configuration.

To enable page views on Cloudflare Workers:

1. Create a D1 database.

   ```bash
   pnpm exec wrangler d1 create polyglow_analytics
   ```

2. Add the runtime variable and D1 binding to `wrangler.jsonc`.

   ```jsonc
   "vars": {
     "PUBLIC_PAGE_VIEWS_ENABLED": "true"
   },
   "d1_databases": [
     {
       "binding": "ANALYTICS_DB",
       "database_name": "polyglow_analytics",
       "database_id": "<database_id>",
       "migrations_dir": "./migrations"
     }
   ]
   ```

3. Apply the migration.

   ```bash
   pnpm exec wrangler d1 migrations apply polyglow_analytics --remote
   ```

4. Build and deploy with page views enabled.

   ```bash
   PUBLIC_PAGE_VIEWS_ENABLED=true pnpm deploy
   ```

This feature only stores page path, count, and update time. It does not collect
IP addresses, user agents, referrers, cookies, or personal identifiers.

## Feedback

Questions, ideas, and bug reports go to [GitHub Issues](https://github.com/realriplab/Polyglow/issues).

## License

MIT. See [LICENSE](LICENSE).
