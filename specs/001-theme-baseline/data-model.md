# 数据模型：Polyglow 主题基线

## 语言

- **来源**：`src/config/locales.ts`
- **字段**：`code`、`nativeName`、`label`、`ogLocale`、`dir`、`searchHint`
- **规则**：默认语言为 `en`；公开页面使用语言前缀；语言切换保持当前内容语义路径；RTL 语言通过 `dir` 输出方向。

## 内容条目

- **来源**：`src/content/posts/**`
- **字段**：`title`、`description`、`category`、`tags`、`pubDate`、`updatedDate`、`authors`、`heroImage`、`heroImageAlt`、`heroImageWidth`、`heroImageHeight`、`canonical`、`seoTitle`、`seoDescription`、`locale`、`slug`、`draft`、`featured`
- **规则**：发布内容必须具备语言、标题、描述、分类、作者、hero 图片和替代文本；远程 hero 图片必须提供宽高；`draft: true` 内容不进入公开列表。

## 静态页面

- **来源**：`src/content/pages/**`
- **字段**：`title`、`description`、`locale`、`slug`、`seoTitle`、`seoDescription`、`noindex`、`draft`
- **规则**：About 等页面通过内容集合管理；公开页面输出 canonical、社交预览和必要 robots 元数据。

## 作者资料

- **来源**：`src/content/authors/**`
- **字段**：`name`、`bio`、`locale`、`slug`、`avatar`、`avatarWidth`、`avatarHeight`、`githubUsername`、`socials`、`draft`
- **规则**：文章作者以 slug 引用作者资料；缺少本地化作者内容时使用明确 fallback，不阻断文章渲染。

## 分类项与标签项

- **来源**：`src/config/taxonomy.ts`
- **字段**：稳定标识、本地化名称、本地化描述、排序信息
- **规则**：分类和标签展示来自配置模型，不能从翻译后的显示文本反推；未配置项在测试或构建检查中暴露。

## 图片资产

- **来源**：`src/assets`、`public/`、授权 HTTPS 远程域名
- **字段**：`src`、`kind`、`alt`、`width`、`height`
- **规则**：本地图片和 `public/` 图片可直接使用；远程图片域名必须在 `src/config/assets.ts` 中被允许；远程 hero 图片必须具备显式宽高。

## 公开路由

- **来源**：`src/pages/**` 与 `src/utils/routes.ts`
- **类型**：首页、分页列表、文章页、分类页、标签页、About、Author、搜索、RSS、站点地图、robots、404
- **规则**：所有读者页面输出当前语言路径；根路径进入 `/en/`；首页和文章列表页每页 20 篇文章，分类页和标签页每页 12 篇文章；SEO helper 统一生成 canonical、alternate、Open Graph、Twitter 和 JSON-LD。
