# 示例内容整理

当前仓库包含一批用于展示主题能力的示例文章。它们用于验证多语言路由、分页、分类、标签、搜索、SEO、图片和文章排版，不代表主题采用者必须保留的内容。

## 示例内容定位

- 展示 11 个语言目录的路由生成能力，其中阿拉伯语用于展示 RTL 阅读方向。
- 保证每个列表页都有足够卡片，便于检查分页和响应式布局。
- 覆盖 `build`、`invest`、`startup`、`life` 等分类。
- 覆盖本地化搜索和 Pagefind 索引。
- 使用授权远程图片域名验证图片策略。

## 采用者清理步骤

1. 备份或删除 `src/content/posts/` 下的示例文章。
2. 保留一篇英文文章和一篇中文文章作为模板。
3. 按 `docs/content/authoring.md` 新建自己的文章。
4. 修改 `src/content/pages/` 下的 About 文案。
5. 修改 `src/content/authors/` 下的作者资料。
6. 按需要调整 `src/config/taxonomy.ts`。
7. 运行 `pnpm theme:check` 和 `pnpm build`。

## 最小内容集

一个可发布站点至少保留：

```text
src/content/posts/en/hello-world.mdx
src/content/pages/en/about.md
src/content/authors/en/default.md
```

如果保留十语言配置，每个语言至少准备一篇文章能获得更完整的演示效果。

## 示例文章模板

复制 `docs/content/authoring.md` 中的最小文章模板，然后替换标题、摘要、分类、标签、日期、图片和正文。

## 图片替换

开源采用者可以完全不使用 R2。建议从以下两种方式开始：

- 把通用图片放入 `public/images/`。
- 把需要 Astro 优化的图片放入 `src/assets/`。

远程图片只适合已经具备稳定 HTTPS 资产域名的项目。
