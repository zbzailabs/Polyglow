# 通用静态托管

Polyglow 输出纯静态文件，不绑定 Cloudflare。采用者可以部署到任何支持静态资源的托管平台。

## 通用构建

```bash
pnpm install
pnpm build
```

构建产物目录：

```text
dist/
```

## 必要环境变量

生产环境设置：

```text
PUBLIC_SITE_URL=https://example.com
```

该变量用于 canonical、Open Graph、sitemap 和 RSS 地址。

## 常见平台

### Vercel

- Build command：`pnpm build`
- Output directory：`dist`
- Install command：`pnpm install`

### Netlify

- Build command：`pnpm build`
- Publish directory：`dist`

### GitHub Pages

使用 GitHub Actions 执行 `pnpm build`，再发布 `dist/`。如果站点部署在子路径，需要单独评估 Astro `base` 配置；当前主题默认面向根域名部署。

### 传统静态服务器

把 `dist/` 上传到 Nginx、Caddy 或对象存储静态托管即可。确保 404 回退和语言路径按平台规则配置。

## 发布前检查

```bash
pnpm theme:check
pnpm build
```

Cloudflare 不是必须路径；使用 Cloudflare 时继续参考 `docs/integrations/cloudflare.md`。
