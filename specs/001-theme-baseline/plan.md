# 实施计划：Polyglow 主题基线

**分支**：`main` | **日期**：2026-05-14 | **规格**：[spec.md](./spec.md)

**输入**：来自 `specs/001-theme-baseline/spec.md` 的功能规格

## 摘要

Polyglow 是 Astro 优先的开源静态多语言博客主题。当前基线保留静态发布、十语言路由、内容集合、分类标签、作者页、搜索、RSS、站点地图、SEO 元数据、图片约束和 Cloudflare 静态部署能力，同时移除 React、shadcn 和强依赖第三方服务的复杂度。

本阶段目标是把已经实现的主题能力纳入 Spec-Driven Development 轨道：补齐计划、研究、数据模型、快速开始、公开契约和任务清单，随后用项目卫生测试、内容测试、Astro 诊断、静态构建和 Playwright 检查持续保护这些能力。

## 技术上下文

**语言/版本**：Astro 6.x 静态站点，TypeScript 6.x，Node.js 24，pnpm 11。

**主要依赖**：Astro、Tailwind CSS 4、`@astrojs/mdx`、`@astrojs/sitemap`、`@astrojs/rss`、`astro-pagefind`、`astro-seo`、`astro-icon`、`@iconify-json/lucide`、`@astrojs/partytown`、`astro-expressive-code`。

**存储**：Git 管理的 Markdown/MDX 内容、本地图片和 `public/` 静态资产；无应用数据库。

**测试**：Vitest 项目检查、内容质量检查、ESLint、`astro check`、`astro build`、Playwright 路由与视觉检查。

**目标平台**：Cloudflare 静态资产部署，也适配同类静态托管平台。

**项目类型**：静态多语言内容主题。

**性能目标**：普通内容页面不加载搜索专用资产；Header、Footer、卡片、分页、语言切换和主题切换保持 Astro 原生；图片通过 Astro `Picture` 输出 AVIF/WebP；客户端脚本仅用于必要交互和已配置的可选统计。

**约束**：公开 URL 保留语言前缀；根路径进入 `/en/`；首页和文章列表页每页 20 篇，分类页和标签页每页 12 篇；所有图标来自 Lucide 图标库；字体使用用户设备默认字体栈；阿拉伯语等 RTL 语言通过 `dir` 支持，中日韩正文两端排列并启用 `text-autospace` 混排间距，西文正文左侧排列；主配色使用 Tailwind neutral。

**规模/范围**：十个配置语言，posts/pages/authors 三类内容集合，首页、文章列表、文章详情、文章 Markdown 端点、分类、标签、About、Author、搜索、RSS、站点地图、robots、`/llms.txt`、`/llms-full.txt` 和 404 页面。

## 宪章检查

_门禁：Phase 0 研究前通过；Phase 1 设计后再次检查。_

- **Astro 优先的静态发布**：通过。公开页面、路由、布局、卡片、RSS、站点地图和图片组件均由 Astro 负责；页面 SEO 元数据使用 astro-seo，结构化数据由 Astro 布局输出。
- **稳定的多语言内容架构**：通过。`src/config/locales.ts` 固定语言列表和默认英文，`src/utils/routes.ts` 统一生成本地化路径。
- **最小客户端 JavaScript**：通过。React 和 shadcn 运行时已移除；Pagefind 只在搜索和 404 恢复页面加载；Partytown 仅在配置统计 ID 后启用。
- **SEO、无障碍和性能门禁**：通过。Vitest 与 Playwright 覆盖 canonical、alternate、JSON-LD、搜索、404、分页、键盘入口和页面结构。
- **AI 可读静态内容**：通过。`/llms.txt`、`/llms-full.txt` 和文章 Markdown 端点均由 Astro 静态构建生成，不引入运行时平台依赖。
- **开源简洁性和可选集成**：通过。R2、统计和未来外部数据组件均为可选；本地图片和 `public/` 图片路径保留。

## 项目结构

### 本功能文档

```text
specs/001-theme-baseline/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── public-site.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### 源码结构

```text
src/
├── components/
│   ├── features/
│   ├── icons/
│   └── ui/
├── config/
├── content/
│   ├── authors/
│   ├── pages/
│   └── posts/
├── i18n/
├── layouts/
├── pages/
├── styles/
└── utils/

tests/
├── *.test.ts
└── e2e/

public/
docs/
specs/
scripts/
```

**结构决策**：展示层继续集中在 `src/components/`、`src/layouts/` 和 `src/pages/`；业务规则集中在 `src/config/` 与 `src/utils/`；内容校验集中在 `src/content.config.ts`；规格与实施记录保存在 `specs/001-theme-baseline/`。

## 复杂度记录

| 事项           | 必要原因                                     | 简化边界                                         |
| -------------- | -------------------------------------------- | ------------------------------------------------ |
| Pagefind       | 提供纯静态本地搜索，不需要托管搜索服务       | 仅搜索页和 404 恢复页面加载搜索资产              |
| Partytown      | 为后续 Google Analytics 预留低干扰加载路径   | 未配置 `PUBLIC_GOOGLE_ANALYTICS_ID` 时不启用集成 |
| Astro 图片优化 | 恢复旧 Polyglow 的图片优化体验并降低传输体积 | 本地和授权远程图片共用 `OptimizedPicture` 包装   |
