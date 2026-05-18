# 主题配置

本文档说明采用者修改 Polyglow 的常用入口。

## 站点信息

文件：`src/config/site.ts`

修改项：

- `name`：站点名称。
- `url`：生产域名，通常通过 `PUBLIC_SITE_URL` 覆盖。
- `description`：默认站点描述。
- `repository`：代码仓库地址。
- `defaultOgImage`：默认社交预览图。
- `homepage.layout`：首页布局。

## 语言

文件：

```text
src/config/locales.ts
src/i18n/*.json
astro.config.mjs
```

修改语言时同步检查：

- Astro i18n 配置。
- Sitemap i18n 配置。
- UI 翻译文件。
- 内容目录。
- `LOCALE_META` 中的方向、名称和搜索提示。

## 导航

Header 和 Footer 位于：

```text
src/components/ui/Header.astro
src/components/ui/Footer.astro
```

导航链接使用 `localePath(lang, "...")` 生成，避免写死语言路径。

## 首页展示

首页路由：

```text
src/pages/[lang]/index.astro
```

首页布局在 `src/config/site.ts` 配置：

```ts
homepage: {
  layout: "cover",
}
```

可选值：

- `cover`：默认封面卡片首页。
- `archive`：归档优先首页。
- `text`：文字卡片首页。

首页和文章列表页当前为每页 20 篇；分类页和标签页当前为每页 12 篇。文章卡片组件位于：

```text
src/components/cards/PostCardCover.astro
src/components/cards/PostCardText.astro
src/components/lists/PostCardGrid.astro
src/components/lists/PostTextCardGrid.astro
```

## 视觉基础

全局样式位于：

```text
src/styles/global.css
```

当前原则：

- 使用系统字体栈。
- 使用 Tailwind neutral 作为默认色系。
- 保留玻璃拟态卡片。
- 明暗主题使用同一语义变量体系。
- 中日韩正文两端排列，西文左侧排列，RTL 语言通过 `dir` 控制。

## 图标

图标通过 `astro-icon` 和 `@iconify-json/lucide` 使用。包装组件：

```text
src/components/icons/Icon.astro
```

新增图标时，在 `astro.config.mjs` 的 `icon({ include: { lucide: [...] } })` 中加入名称。

## 搜索

搜索由 Pagefind 生成。搜索页：

```text
src/pages/[lang]/search.astro
```

普通内容页不加载搜索专用资产。

## 集成边界

默认不启用 CMS、评论、会员、登录、浏览器上传和实时第三方个人资料组件。新增这些能力前，先新增独立规格并确认它仍然适合作为博客主题。
