# Image Strategy

Polyglow supports local images, public static images, and approved remote HTTPS images. Cloudflare R2 is optional. A fork can ship without R2 by keeping images in `src/assets`, `public`, or a configured HTTPS asset host.

## Supported Sources

### Bundled Source Assets

Use `src/assets` for images that should be processed by Astro.

```text
src/assets/
  covers/
    example-cover.avif
```

This source is best for stable project assets that benefit from Astro image optimization.

### Public Static Files

Use `public` for files that should be served unchanged.

```text
public/
  open-graph.webp
  images/
    logo.webp
```

Reference public files with an absolute path:

```yaml
heroImage: "/open-graph.webp"
heroImageAlt: "Abstract Polyglow cover image"
```

### Remote HTTPS Images

Remote images must use an allowed HTTPS host. The default allowlist is:

```text
assets.polyglow.realrip.com
images.unsplash.com
```

Remote hero images must include dimensions:

```yaml
heroImage: "https://assets.polyglow.realrip.com/posts/en/my-post/cover.avif"
heroImageAlt: "Article cover image"
heroImageWidth: 1600
heroImageHeight: 900
```

Dimensions are required to keep layout shift predictable.

## Configuration

Update both files when adding a remote asset host:

```text
astro.config.mjs
src/config/assets.ts
```

`astro.config.mjs` controls Astro's remote image policy. `src/config/assets.ts` controls project-level validation and helper behavior.

## Optional R2 Workflow

R2 support is intentionally optional. It is not part of the default adoption path. The scripts under `scripts/` are extension points:

```bash
pnpm assets:check
pnpm assets:upload
```

`assets:check` validates remote image hosts referenced in content. `assets:upload` currently documents the expected extension point and does not block local development.

Projects that use R2 can set:

```bash
PUBLIC_ASSET_BASE_URL=https://assets.polyglow.realrip.com
```

Leave `PUBLIC_ASSET_BASE_URL` unset when the project uses only local images or approved third-party hosts. Use a custom domain for production R2 assets. Do not reference temporary provider domains in frontmatter, RSS, Open Graph images, or JSON-LD.

## Recommended Open-Source Default

For a theme fork, start with `public/` images. Move images into `src/assets` only when Astro transformation is useful. Add R2 or another asset host after the site already builds locally.

## Naming Guidance

Recommended object key shape:

```text
posts/{locale}/{slug}/{hash}.{ext}
```

Examples:

```text
posts/en/my-post/9f8a7b6c.avif
posts/zh/my-post/9f8a7b6c.webp
```

Use immutable filenames for long-lived cache behavior. If an image changes, create a new object key.

## Author Checklist

- Use descriptive `heroImageAlt`.
- Provide `heroImageWidth` and `heroImageHeight` for remote hero images.
- Keep production remote images on approved HTTPS hosts.
- Prefer `src/assets` or `public` for forks that do not need external storage.
- Run `pnpm assets:check` before publishing.
