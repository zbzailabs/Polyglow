# 快速开始：Polyglow 主题基线

## 环境

- Node.js 24
- pnpm 11
- Git

## 本地运行

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:4321/en/` 检查默认英文首页。

## 常规验证

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

完整门禁：

```bash
pnpm check
```

浏览器检查：

```bash
pnpm test:e2e:ci
```

## 重点验收路径

- `/` 进入 `/en/`
- `/en/` 首页展示 20 张文章卡片并显示分页
- `/en/posts/` 展示文章列表
- `/en/posts/20150714-agiot/` 输出文章详情、JSON-LD、canonical 和 alternate
- `/en/category/invest/` 展示分类页
- `/en/tags/risk/` 展示标签页
- `/en/search/` 加载 Pagefind 搜索
- `/en/author/` 展示作者页
- `/en/not-a-real-page/` 返回本地化 404

## 可选配置

`.env.example` 给出生产域名和可选统计配置。没有私有凭据时，本地开发和静态构建仍然可以完成。

```bash
PUBLIC_SITE_URL=https://polyglow.realrip.com
PUBLIC_ASSET_BASE_URL=
PUBLIC_GOOGLE_ANALYTICS_ID=
```

## 部署前检查

```bash
pnpm run deploy:check
pnpm run build
```

Cloudflare 部署需要在平台配置生产域名和 API Token。主题本身不强制使用 R2；采用者可以继续使用本地图片或 `public/` 图片。
