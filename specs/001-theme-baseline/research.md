# 研究记录：Polyglow 主题基线

## 决策：保留 Astro 原生为主渲染层

**理由**：主题输出面向静态 HTML，首页、文章、列表、分类、标签、About、Author、搜索壳、RSS、站点地图和 404 都可以由 Astro 完成。移除 React 和 shadcn 后，构建依赖更少，客户端 JavaScript 更可控，开源用户理解和修改成本更低。

**禁用方案**：使用 React islands 和 shadcn。该方案能快速获得复杂交互组件，但本主题的真实交互规模很小，额外运行时与样式约束不符合“最小客户端 JavaScript”原则。

## 决策：使用 Pagefind 作为静态搜索

**理由**：Pagefind 在构建时生成索引，满足本地化搜索需求，不依赖托管搜索服务，也不需要私有凭据。

**抛弃方案**：Algolia、Meilisearch 或自建 API。它们适合更复杂检索场景，但会增加部署与维护成本，不符合主题默认体验。

## 决策：Lucide 通过 Astro Icon 使用

**理由**：`astro-icon` 与 `@iconify-json/lucide` 能在 Astro 组件中直接输出图标，避免 `lucide-react` 和 React 依赖，同时保留统一图标语义。

**抛弃方案**：手写 SVG 或继续使用 `lucide-react`。手写 SVG 维护成本较高；`lucide-react` 会重新引入 React 运行时。

## 决策：统计能力通过 Partytown 预留

**理由**：主题默认不开启统计；采用者配置 `PUBLIC_GOOGLE_ANALYTICS_ID` 后再启用 Partytown，减少第三方脚本对主线程的影响。

**抛弃方案**：默认加载 Google Analytics。该方案会破坏开源主题的无凭据运行目标。

## 决策：图片使用 Astro `Picture` 包装

**理由**：`OptimizedPicture.astro` 统一处理本地、`public/` 和授权远程图片，输出 AVIF/WebP，并在内容 schema 层要求远程 hero 图片提供宽高。

**抛弃方案**：直接输出 `<img>`。该方案更简单，但无法稳定获得格式转换、尺寸约束和布局稳定保护。

## 决策：Tailwind neutral 与系统字体栈作为默认视觉基础

**理由**：neutral 色系适合开源博客主题，不把采用者锁定在强品牌色上；系统字体栈减少字体资源加载并适配多语言环境。

**抛弃方案**：继续使用外部字体和高饱和品牌渐变。该方案视觉更强，但会增加下载体积并降低主题复用性。
