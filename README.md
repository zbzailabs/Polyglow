# Polyglow

Polyglow is an Astro static blog theme for writers and small teams who want to publish multilingual articles without building a blog system from scratch.

It ships with locale routes, content collections, categories, tags, author pages, search, RSS, sitemap, SEO metadata, optimized images, light/dark themes, and static deployment support.

## Start Writing

Requirements:

- Node.js 24 or newer
- pnpm 11

Run the site locally:

```bash
pnpm install
pnpm dev
```

Astro prints the local URL, usually:

```text
http://localhost:4321/en/
```

## Use This Theme

Start with these guides:

- [Fork guide](docs/adoption/fork-guide.md): change the site name, domain, author, and starter content.
- [Minimal content](docs/adoption/minimal-content.md): replace the demo set with one post, one About page, and one author profile.
- [Demo content](docs/content/demo-content.md): understand and remove the bundled sample posts.
- [Content authoring](docs/content/authoring.md): write posts, pages, authors, categories, tags, drafts, and multilingual content.
- [Theme configuration](docs/configuration/theme.md): configure site information, locales, navigation, homepage layout, visual tokens, icons, and search.
- [Image strategy](docs/content/images.md): use local images, public images, remote images, and optional asset hosting.
- [Theme preview](docs/adoption/preview.md): preview the three homepage layouts.
- [Cloudflare deployment](docs/integrations/cloudflare.md): publish with Wrangler or Cloudflare Pages.
- [Static hosting](docs/integrations/static-hosting.md): publish to Vercel, Netlify, GitHub Pages, or a generic static server.
- [Analytics](docs/integrations/analytics.md): optional Google Analytics through Partytown.
- [Release preflight](docs/release/preflight.md): final checks before publishing your fork.

## Common Commands

```bash
pnpm dev          # Start local development
pnpm build        # Build the static site
pnpm preview      # Preview the built site locally
pnpm theme:init   # Prepare first-run site identity changes
pnpm theme:reset  # Preview replacing demo content with minimal content
pnpm theme:check  # Check whether starter identity values remain
pnpm deploy       # Build and deploy with Wrangler
```

## Content

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

## Locales

The default locale is `en`, and all public pages use a locale prefix.

Configured locales:

```text
zh en fr es ru ja ko pt de id ar
```

Edit UI strings in `src/i18n/*.json`. Add or edit content in the matching locale folder under `src/content`.

## Configuration

Common configuration files:

```text
src/config/site.ts
src/config/locales.ts
src/config/taxonomy.ts
src/config/features.ts
src/config/assets.ts
```

`src/config/site.ts` includes the homepage layout:

- `cover`: image-led homepage.
- `archive`: compact archive-first homepage.
- `text`: text-card homepage for low-image publishing.

Environment variables:

- `PUBLIC_SITE_URL`: production origin for canonical URLs, sitemap entries, and Open Graph URLs.
- `PUBLIC_ASSET_BASE_URL`: optional first-party asset origin.
- `PUBLIC_GOOGLE_ANALYTICS_ID`: optional Google Analytics measurement ID.

## Search And AI-Readable Content

Search is powered by Pagefind and generated during `astro build`. Search assets load only on search and 404 recovery pages.

Polyglow also generates static content surfaces:

- `/llms.txt`
- `/llms-full.txt`
- `/:lang/posts/:slug.md`

These files require no paid AI service, Worker, or account token.

## Deployment

The site builds to static output in `dist`.

For Cloudflare with Wrangler:

```bash
pnpm deploy
```

For other static hosts, use:

```bash
pnpm build
```

Then publish `dist`.

## Feedback

Questions, ideas, and bug reports should go through GitHub Issues:

- [Bug report](https://github.com/realriplab/Polyglow-next/issues/new?template=bug_report.yml)
- [Feature request](https://github.com/realriplab/Polyglow-next/issues/new?template=feature_request.yml)

Security issues follow [SECURITY.md](SECURITY.md). Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Polyglow is released under the MIT License. See [LICENSE](LICENSE).
