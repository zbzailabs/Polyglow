# Polyglow 中文说明

Polyglow 是一个面向写作者和小团队的 Astro 静态博客主题。目标是让用户 fork 后直接配置站点、替换示例内容、开始写文章，而不是研究项目开发过程。

主题内置多语言路由、内容集合、分类、标签、作者页、搜索、RSS、站点地图、SEO 元数据、图片优化、明暗主题和静态部署支持。

## 开始写作

环境要求：

- Node.js 24 或更新版本
- pnpm 11

本地运行：

```bash
pnpm install
pnpm dev
```

Astro 会输出本地访问地址，通常是：

```text
http://localhost:4321/en/
```

## 采用主题

优先阅读以下文档：

- [Fork 后改造指南](docs/adoption/fork-guide.md)：修改站点名、域名、作者和示例内容。
- [最小内容模板](docs/adoption/minimal-content.md)：用一篇文章、一个 About 页面和一个作者资料开始。
- [示例内容说明](docs/content/demo-content.md)：理解并删除内置示例文章。
- [内容写作指南](docs/content/authoring.md)：编写文章、页面、作者、分类、标签、草稿和多语言内容。
- [主题配置](docs/configuration/theme.md)：配置站点信息、语言、导航、首页布局、视觉 token、图标和搜索。
- [图片策略](docs/content/images.md)：使用本地图片、public 图片、远程图片和可选资产托管。
- [主题预览](docs/adoption/preview.md)：查看三种首页布局。
- [Cloudflare 部署](docs/integrations/cloudflare.md)：使用 Wrangler 或 Cloudflare Pages 发布。
- [通用静态托管](docs/integrations/static-hosting.md)：发布到 Vercel、Netlify、GitHub Pages 或普通静态服务器。
- [统计集成](docs/integrations/analytics.md)：可选 Google Analytics。
- [发布前检查](docs/release/preflight.md)：发布 fork 前的最终检查。

## 常用命令

```bash
pnpm dev          # 本地开发
pnpm build        # 构建静态站点
pnpm preview      # 本地预览构建结果
pnpm theme:init   # 根据命令参数准备首次站点信息修改
pnpm theme:reset  # 预览用最小内容替换示例内容
pnpm theme:check  # 检查是否仍保留主题默认身份信息
pnpm deploy       # 使用 Wrangler 构建并部署
```

## 内容

内容位于 `src/content`：

```text
src/content/
  authors/
  pages/
  posts/
```

文章按语言目录存放：

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

文章 frontmatter：

```yaml
---
title: "文章标题"
description: "用于卡片和 SEO 的简短摘要。"
category: "build"
tags: ["strategy"]
pubDate: 2026-05-12
updatedDate: 2026-05-12
authors: ["default"]
heroImage: "/open-graph.webp"
heroImageAlt: "图片替代文本"
locale: "zh"
slug: "my-post"
draft: false
featured: false
---
```

远程 `heroImage` 需要同时填写 `heroImageWidth` 和 `heroImageHeight`。

## 多语言

默认语言为 `en`，公开页面都带语言前缀。

已配置语言：

```text
zh en fr es ru ja ko pt de id
```

界面文案在 `src/i18n/*.json` 中修改。内容按语言放入 `src/content` 下对应目录。

## 配置

常用配置文件：

```text
src/config/site.ts
src/config/locales.ts
src/config/taxonomy.ts
src/config/features.ts
src/config/assets.ts
```

`src/config/site.ts` 包含首页布局：

- `cover`：图片封面首页。
- `archive`：紧凑归档首页。
- `text`：文字卡片首页，适合少图内容。

环境变量：

- `PUBLIC_SITE_URL`：生产站点域名，用于 canonical、sitemap 和 Open Graph。
- `PUBLIC_ASSET_BASE_URL`：可选的第一方图片资源域名。
- `PUBLIC_GOOGLE_ANALYTICS_ID`：可选 Google Analytics ID。

## 搜索和 AI 可读内容

搜索由 Pagefind 在 `astro build` 时生成。搜索资产只在搜索页和 404 恢复页加载。

Polyglow 还会生成静态内容入口：

- `/llms.txt`
- `/llms-full.txt`
- `/:lang/posts/:slug.md`

这些文件不需要付费 AI 服务、Worker 或账号 token。

## 部署

站点构建结果位于 `dist`。

使用 Cloudflare Wrangler：

```bash
pnpm deploy
```

其他静态托管平台：

```bash
pnpm build
```

然后发布 `dist` 目录。

## 反馈

疑问、想法和 bug 反馈通过 GitHub Issues 提交：

- [Bug report](https://github.com/realriplab/Polyglow-next/issues/new?template=bug_report.yml)
- [Feature request](https://github.com/realriplab/Polyglow-next/issues/new?template=feature_request.yml)

安全问题按 [SECURITY.md](SECURITY.md) 处理。贡献说明见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

Polyglow 使用 MIT License。详见 [LICENSE](LICENSE)。
