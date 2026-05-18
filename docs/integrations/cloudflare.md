# Cloudflare 部署

Polyglow 输出静态站点，适合部署到 Cloudflare。项目支持 Wrangler 静态资源部署，也能部署到 Cloudflare Pages。

## 必要环境变量

```bash
PUBLIC_SITE_URL=https://polyglow.realrip.com
CLOUDFLARE_API_TOKEN=...
```

`PUBLIC_SITE_URL` 用于 canonical、sitemap、Open Graph 和 JSON-LD。部署前检查会拒绝本地地址、占位域名和非 HTTPS 生产地址。

## Wrangler 部署

本仓库包含 `wrangler.jsonc`。部署命令：

```bash
pnpm deploy
```

该命令会依次运行：

```bash
pnpm run deploy:check
pnpm run build
wrangler deploy
```

`wrangler.jsonc` 使用 Workers Static Assets 配置：

```json
{
  "assets": {
    "directory": "./dist",
    "html_handling": "force-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

这一路径适合静态主题发布。当前项目没有 Worker 业务脚本；如果以后要在同一 URL 上实现 `Accept: text/markdown` 内容协商，再增加 Worker `main` 入口和 assets binding。

## Cloudflare Pages

Cloudflare Pages 配置：

```text
Build command: pnpm build
Build output directory: dist
Node version: 24
```

环境变量：

```text
PUBLIC_SITE_URL=https://your-domain.example
```

## AI 可读内容与 Markdown for Agents

Polyglow 在构建时生成以下静态 AI 内容入口：

- `/llms.txt`
- `/llms-full.txt`
- `/:lang/posts/:slug.md`

这些文件不需要 Cloudflare 专有功能，也不需要 API token。它们适合 AI Agent、搜索工具、RAG 索引和内容审计直接读取。

部署在 Cloudflare 的站点还可以在 zone 中启用 Markdown for Agents。该功能由 Cloudflare 平台处理 `Accept: text/markdown` 内容协商，把 HTML 页面转换为 Markdown 返回给支持该请求头的客户端。启用后，源码不需要新增 Worker 脚本。

建议策略：

- 开源主题默认使用静态 `/llms.txt`、`/llms-full.txt` 和 `/:lang/posts/:slug.md`。
- Cloudflare 用户按需启用 Markdown for Agents。
- 不把 Workers AI Markdown Conversion 作为默认构建链路；它更适合外部 HTML、PDF 或文档迁移。

## R2

R2 不是默认要求。采用者使用本地图片或 `public/` 图片时，不需要 R2。

使用 R2 或其他远程资产域名时，配置：

```bash
PUBLIC_ASSET_BASE_URL=https://assets.example.com
```

同时检查：

```text
astro.config.mjs
src/config/assets.ts
```

## 发布前检查

发布前本地检查：

```bash
pnpm assets:check
pnpm build
pnpm run deploy:check
```
