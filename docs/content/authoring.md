# 内容写作指南

Polyglow 使用 Astro Content Collections 管理内容。内容文件保存在 `src/content/`。

```text
src/content/
├── authors/
├── pages/
└── posts/
```

## 新增文章

文章按语言分目录：

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

最小文章模板：

```mdx
---
title: "My Post"
description: "A concise summary for cards and metadata."
category: "build"
tags:
  - "strategy"
pubDate: 2026-05-14
authors:
  - "default"
heroImage: "/open-graph.webp"
heroImageAlt: "Abstract Polyglow cover image"
draft: false
featured: false
locale: en
slug: "my-post"
---

## Overview

Write the article body here.
```

## 新增页面

静态页面保存在 `src/content/pages/{locale}/`。About 页面示例：

```text
src/content/pages/en/about.md
src/content/pages/zh/about.md
```

页面 frontmatter：

```yaml
---
title: "About"
description: "About this site."
locale: en
slug: "about"
draft: false
---
```

## 新增作者

作者资料保存在 `src/content/authors/{locale}/`。文章通过 `authors` 数组引用作者 slug。

```yaml
---
name: "Polyglow Editorial"
bio: "A concise author bio."
locale: en
slug: "default"
draft: false
socials:
  - label: "GitHub"
    url: "https://github.com/realriplab/Polyglow-next"
---
```

## 分类和标签

分类与标签配置在 `src/config/taxonomy.ts`。新增分类或标签时，先在配置中添加稳定标识和多语言展示文案，再在文章 frontmatter 中引用标识。

## 图片

本地图片优先使用 `public/` 或 `src/assets/`。远程图片必须来自允许域名。远程 hero 图片填写尺寸：

```yaml
heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
heroImageAlt: "Research desk"
heroImageWidth: 1600
heroImageHeight: 1067
```

发布前运行：

```bash
pnpm assets:check
```

## 草稿

设置 `draft: true` 后，内容不进入公开列表。发布前改为 `draft: false`。

## 多语言内容

每个语言目录独立维护内容。语言列表来自 `src/config/locales.ts`。缺少对应语言内容时，站点仍然保留该语言的公共路由，但发布用内容建议逐步补齐。
