# 公开站点契约：Polyglow 主题基线

## 路由契约

- 根路径 `/` 进入 `/en/`。
- 支持语言：`zh`、`en`、`fr`、`es`、`ru`、`ja`、`ko`、`pt`、`de`、`id`。
- 语言首页：`/:lang/`
- 首页分页：`/:lang/:page/`
- 文章列表：`/:lang/posts/` 与 `/:lang/posts/:page/`
- 文章详情：`/:lang/posts/:slug/`
- 文章 Markdown：`/:lang/posts/:slug.md`
- 分类页：`/:lang/category/:slug/` 与 `/:lang/category/:slug/:page/`
- 标签页：`/:lang/tags/:slug/` 与 `/:lang/tags/:slug/:page/`
- About：`/:lang/about/`
- Author：`/:lang/author/`
- 搜索：`/:lang/search/`
- RSS：`/:lang/rss.xml`
- AI 内容索引：`/llms.txt` 与 `/llms-full.txt`
- 404：`/:lang/404/` 以及不存在路由的恢复页面

## 元数据契约

- 公开 HTML 页面输出 canonical。
- 多语言页面输出自引用 alternate、其他语言 alternate 和 `x-default`。
- 文章页输出 `BlogPosting` JSON-LD。
- 普通页面输出 WebPage 或站点级结构化数据。
- Open Graph 与 Twitter 元数据使用当前页面标题、描述和可用图片。

## 搜索契约

- Pagefind 索引在静态构建后生成。
- 只有搜索页和 404 恢复页面加载搜索 UI 资产。
- 搜索结果链接保持当前语言路径。

## AI 可读内容契约

- `/llms.txt` 输出站点摘要、主要入口、支持语言、完整索引入口和近期文章。
- `/llms-full.txt` 按语言列出全部已发布文章的 HTML 地址、Markdown 地址、摘要、分类、标签和发布时间。
- `/:lang/posts/:slug.md` 输出单篇文章的 Markdown 版本，包含 frontmatter 元数据、canonical、Markdown 地址和清理后的正文。
- 这些文件在静态构建阶段生成，不依赖 Worker 脚本、Workers AI、R2 或私有凭据。

## 图片契约

- 本地图片、`public/` 图片和授权 HTTPS 远程图片都通过统一图片组件渲染。
- 远程 hero 图片包含宽度和高度。
- 未授权远程图片域名在发布检查中失败。

## 可选集成契约

- 没有 `PUBLIC_GOOGLE_ANALYTICS_ID` 时，不启用 Partytown 统计集成。
- 没有 `PUBLIC_ASSET_BASE_URL` 时，不增加私有资产域名要求。
- Cloudflare Markdown for Agents 是部署平台可选增强，不属于本主题默认构建依赖。
- GitHub 日历、CMS、评论、会员、登录和浏览器直传不属于本基线。
