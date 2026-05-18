# 发布前检查

本文档用于发布 fork 后站点前的最终检查。目标是确认站点身份、内容、图片、搜索和部署配置都已经替换为自己的信息。

## 1. 站点身份

- `src/config/site.ts` 中的站点名、生产域名、描述、仓库地址已经改成自己的信息。
- `.env` 或部署平台环境变量已设置 `PUBLIC_SITE_URL`。
- README、About 页面、作者资料不再保留默认主题身份。

可运行：

```bash
pnpm theme:check
```

## 2. 内容

- 示例文章已经替换为自己的内容，或已经执行最小内容替换流程。
- About 页面介绍的是当前站点。
- 作者资料、头像、社交链接和 RSS 地址正确。
- 文章 frontmatter 包含 `title`、`description`、`category`、`tags`、`pubDate`、`authors`、`heroImage`、`heroImageAlt`、`locale`。
- 远程 `heroImage` 包含宽高。
- 分类和标签来自 `src/config/taxonomy.ts`。

## 3. 页面体验

- 首页、文章页、分类页、标签页、搜索页、About、Author、404 在桌面和移动端检查。
- 明暗主题切换正常。
- 语言切换保持当前内容语义路径。
- 搜索可以找到已发布文章。
- RSS、sitemap 和 robots 输出正常。

## 4. 可选集成

- Google Analytics 文档说明未配置时不加载统计脚本。
- Cloudflare 文档说明 Wrangler 与 Cloudflare Pages 两种发布方式。
- R2 仅作为可选资产方案，项目默认支持本地图片和 `public/` 图片。
- 远程图片域名配置同时修改 `astro.config.mjs` 和 `src/config/assets.ts`。

## 5. 构建和部署

发布前执行：

```bash
pnpm assets:check
pnpm build
pnpm run deploy:check
```

Cloudflare Wrangler 部署：

```bash
pnpm deploy
```

其他静态托管平台执行 `pnpm build` 后发布 `dist` 目录。

## 6. 反馈入口

公开站点后，用户疑问、想法和 bug 反馈可以提交到 GitHub Issues：

- Bug report：`https://github.com/realriplab/Polyglow-next/issues/new?template=bug_report.yml`
- Feature request：`https://github.com/realriplab/Polyglow-next/issues/new?template=feature_request.yml`
