# Fork 后十分钟改造指南

本指南面向刚 fork Polyglow 的采用者。目标是在短时间内把默认主题改成自己的内容站，并完成本地验证。

## 前置条件

- Node.js 24
- pnpm 11
- Git

## 第一步：安装和启动

```bash
pnpm install
pnpm dev
```

打开 Astro 输出的本地地址，默认通常是 `http://localhost:4321/en/`。

## 第二步：改必须配置

可以先用命令准备核心身份信息：

```bash
pnpm theme:init -- --site-name "Field Notes" --site-url "https://example.com" --repository "https://github.com/example/field-notes" --author-name "Your Name" --author-bio "Short biography." --about-description "Independent notes and research."
```

确认输出后写入文件：

```bash
pnpm theme:init -- --apply --site-name "Field Notes" --site-url "https://example.com" --repository "https://github.com/example/field-notes" --author-name "Your Name" --author-bio "Short biography." --about-description "Independent notes and research."
```

必须修改：

```text
src/config/site.ts
src/content/authors/en/default.md
src/content/pages/en/about.md
README.md
readme-zh.md
```

重点修改：

- 站点名称。
- 生产域名。
- 仓库链接。
- 作者名称和简介。
- About 页面。
- README 中的项目说明。

## 第三步：替换示例内容

如果想直接从干净内容开始，优先使用最小内容模板。

先查看将要复制的最小模板：

```bash
pnpm theme:reset
```

确认后复制最小内容：

```bash
pnpm theme:reset -- --apply
```

该命令不会默认删除自定义内容。需要完全替换时再使用显式参数：

```bash
pnpm theme:reset -- --apply --replace
```

## 第四步：检查默认值残留

```bash
pnpm theme:check
```

该命令会检查默认站点名、默认域名、默认仓库链接、默认作者、README、About、作者链接和示例文章内容。

## 第五步：验证站点

```bash
pnpm theme:check
pnpm build
```

完成后检查：

- `/en/`
- `/en/posts/hello-world/`
- `/en/about/`
- `/en/author/`

## 常见问题

### `theme:check` 报告默认域名

修改 `src/config/site.ts`，并在部署环境设置 `PUBLIC_SITE_URL`。

### 重置后文章数量变少

这是预期结果。最小模板只保留一个起始文章，用于帮助采用者从干净内容开始。

### 不使用 Cloudflare

可以只运行 `pnpm build` 并把 `dist/` 部署到任何静态托管平台。
更多静态托管方式见 `docs/integrations/static-hosting.md`。
