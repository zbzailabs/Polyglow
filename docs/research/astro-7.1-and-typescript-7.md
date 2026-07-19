# Astro 7.1 与 TypeScript 7.0 调研

调研日期：2026-07-19

## 结论

- Astro 7.1.0 的官方发布记录包含 **5 项正式新增能力**：CSP 细分指令、分页 URL `format()`、`astro dev --ignore-lock`、内容集合 `glob()` 的 `deferRender`、logger 的 URL 入口。另有 **1 项实验能力** `experimental.collectionStorage`，不属于正式功能。[Astro 7.1 博客](https://astro.build/blog/astro-710/)；[Astro 7.1.0 release](https://github.com/withastro/astro/releases/tag/astro%407.1.0)
- 官方博客还把 `AstroRuntimeLogger` 类型列入 logger 改进，但参考文档标注它从 Astro 7.0.8 起已经提供；升级到 7.1 后可直接使用，不需要配置。[Logger API](https://docs.astro.build/en/reference/logger-reference/#astroruntimelogger)
- TypeScript 官方博客确实明确说明：使用 Vue、MDX、Astro、Svelte 等嵌入式语言的项目目前需要继续使用 TypeScript 6.0。原因是 TypeScript 7.0 没有稳定的编程 API，Volar 一类工具只能依赖 TypeScript 6.0。这是当前阶段的限制，并非永久放弃 Astro 支持；TypeScript 团队表示会与这些项目的维护者合作解决。[TypeScript 7.0：TypeScript and Embedded Languages](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#typescript-and-embedded-languages)
- Polyglow 应暂时保留 TypeScript 6.0。Astro 7.1.0 同版本的 `@astrojs/check@0.9.9` peer dependency 也只接受 TypeScript 5 或 6，Astro 维护者确认 TypeScript 7 当前不能支持 Astro、Vue、Svelte 等语言工作流。[`@astrojs/check@0.9.9` package.json](https://github.com/withastro/astro/blob/astro%407.1.0/packages/language-tools/astro-check/package.json)；[Astro issue #17268 的维护者说明](https://github.com/withastro/astro/issues/17268#issuecomment-4926208574)

## 正式新增能力

### 1. CSP 细分脚本与样式指令

Astro 的 CSP 配置和运行时 API 新增 `kind`，可以把资源或哈希分别放入 `script-src-elem`、`script-src-attr`、`style-src-elem`、`style-src-attr`，也可用 `"default"` 保持原来的 `script-src` 或 `style-src`。这样可以只允许行内 `style` 属性，而不同时放宽 `<style>` 与 `<link>` 的策略。[Astro 7.1 博客](https://astro.build/blog/astro-710/#finer-grained-csp-control-for-inline-scripts-and-styles)；[CSP 配置参考](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)；[CSP 运行时 API](https://docs.astro.build/en/reference/api-reference/#cspinsertstyleresource)

- 状态：正式功能。
- 启用方式：需要先显式启用 `security.csp`，并在相应 `resources` 或 `hashes` 条目中设置 `kind`；运行时也可向 `Astro.csp` 传入带 `kind` 的对象。
- 默认行为：`security.csp` 默认是 `false`；升级本身不会生成 CSP。既有字符串配置继续使用通用指令。
- Polyglow 注意事项：官方文档列明 Astro 的 CSP 实现不支持 `<ClientRouter />`。本项目使用 `ClientRouter`，因此不能仅为了使用 7.1 的新 API 而开启 CSP；应等 Astro 官方支持，或先另行迁移路由过渡方案。[CSP 限制](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)

### 2. 完全控制分页 URL

`paginate()` 的选项新增 `format(url)`，可改写 `page.url.current`、`prev`、`next`、`first`、`last` 等生成的 URL。例如，`build.format: "file"` 且托管服务没有 URL 重写时，可以追加 `.html`。[Astro 7.1 博客](https://astro.build/blog/astro-710/#full-control-over-pagination-urls)；[路由参考](https://docs.astro.build/en/reference/routing-reference/#paginate)

- 状态：正式功能。
- 启用方式：在每个需要改写 URL 的 `paginate(data, { format })` 调用中显式传入函数。
- 默认行为：省略 `format` 时保持原有 URL，不会自动变化。
- Polyglow 注意事项：项目使用 `trailingSlash: "always"` 和普通静态目录 URL，现有分页 URL 已与部署形式一致。没有合理的统一改写规则时不应添加恒等函数；升级 Astro 后 API 已可用。

### 3. 同一项目同时运行多个开发服务器

`astro dev --ignore-lock` 会跳过开发服务器锁文件的读取和写入，因此可以给同一项目启动第二个前台开发服务器。这个实例不会被 `astro dev stop`、`status` 或 `logs` 管理，也不能与 `--background`、自动识别的 AI agent 后台模式或 `--force` 一起使用。[Astro 7.1 博客](https://astro.build/blog/astro-710/#run-multiple-dev-servers-at-once)；[CLI 参考](https://docs.astro.build/en/reference/cli-reference/#--ignore-lock)

- 状态：正式功能。
- 启用方式：需要时显式执行 `pnpm astro dev --ignore-lock --port <另一个端口>`。
- 默认行为：普通 `astro dev` 继续使用锁文件；升级后不会自动并行启动服务器。
- Polyglow 注意事项：这是临时命令能力，不适合加入现有受管理的 `dev:background` 流程。

### 4. 延迟渲染大型 Markdown 内容集合

`glob()` loader 新增 `deferRender: true`。启用后，Markdown 条目在内容同步时只存储，不预先渲染；页面真正调用渲染时才生成 HTML。这样可降低大型集合在同步和构建时的内存占用，代价是不能跨构建复用已渲染 HTML 缓存。该选项不适用于 MDX、Markdoc 和 JSON/YAML 等数据条目。[Astro 7.1 博客](https://astro.build/blog/astro-710/#lower-memory-usage-for-large-content-collections)；[Content Loader API](https://docs.astro.build/en/reference/content-loader-reference/#deferrender)

- 状态：正式功能。
- 启用方式：在适用集合的 `glob({ ..., deferRender: true })` 中显式设置。
- 默认行为：默认 `false`，继续同步时预渲染并缓存 HTML。
- Polyglow 注意事项：这是本次新增功能中最适合直接在现有 Markdown 集合启用的一项，但应在升级后用完整构建验证内存、构建耗时和输出一致性。

### 5. logger 入口接受 URL

自定义 logger 的 `logger.entrypoint` 现在除字符串路径或包名外，还能接受 `new URL("./logger.js", import.meta.url)`。这允许使用相对配置文件的位置解析入口，并与 sessions、fonts 等 API 的入口形式一致。[Astro 7.1 博客](https://astro.build/blog/astro-710/#logger-improvements)；[配置参考：`logger.entrypoint`](https://docs.astro.build/en/reference/configuration-reference/#loggerentrypoint)

- 状态：正式功能。
- 启用方式：只有项目已有或新增自定义 logger 时，才在 `astro.config.mjs` 中显式配置 URL 入口。
- 默认行为：Astro 继续使用内置 Node logger；升级后日志格式不会自动变化。
- Polyglow 注意事项：项目目前没有自定义 logger，因此没有需要迁移或开启的配置。

### 6. `AstroRuntimeLogger` 类型

官方 7.1 博客同时介绍了可从 `astro` 导入的 `AstroRuntimeLogger` 类型，用于标注接收运行时 logger 的函数。参考文档将其版本标为 7.0.8，因此它不是 7.1.0 release 中单独的 minor change，但属于升级到 7.1 后可用的正式 API。[Astro 7.1 博客](https://astro.build/blog/astro-710/#logger-improvements)；[Logger API](https://docs.astro.build/en/reference/logger-reference/#astroruntimelogger)

- 状态：正式类型 API。
- 启用方式：无需配置，需要时执行 `import type { AstroRuntimeLogger } from "astro"`。
- 默认行为：没有运行时变化。

## 实验能力：不计入“所有正式功能”

`experimental.collectionStorage: "chunked"` 会把原本单一的 `.astro/data-store.json` 拆分为 `.astro/data-store/` 下的多个内容寻址文件；当前文档说明每个分块超过 10 MB 时开始新分块。默认值是 `"single-file"`。[Astro 7.1 博客](https://astro.build/blog/astro-710/#experimental-content-storage)；[实验性 collection storage 文档](https://docs.astro.build/en/reference/experimental-flags/collection-storage/)

Astro 官方说明实验功能可能在 patch 版本中出现不兼容变更。用户要求启用正式功能，因此本轮不应启用 `experimental.collectionStorage`。[实验功能说明](https://docs.astro.build/en/reference/experimental-flags/)

## 自动生效的修复

升级到 Astro 7.1.0 后，下列 patch 修复无需额外配置即可生效：

- JSON logger 在 Cloudflare workerd 等非 Node 运行时不再依赖 `process.stdout` / `stderr`。
- integration 可以通过 `updateConfig()` 更新 logger。
- CSP 元素细分指令保留既有脚本与样式资源行为。
- 浏览器直接访问带 `?url` 的导入资源时，开发服务器不再错误返回 404。
- 移除 `AstroLoggerDestination` 未使用且未记录的泛型。
- 加固动态值嵌入生成的 view-transition 样式、开发元数据和 server-island URL。

来源：[Astro 7.1.0 release 的 Patch Changes](https://github.com/withastro/astro/releases/tag/astro%407.1.0)

## TypeScript 7.0 是否明确不支持 Astro

是，且 TypeScript 官方文章的措辞比“可能有兼容问题”更明确：

1. TypeScript 7.0 不提供稳定的编程 API；官方预计 7.1 才提供新的、不同的 API。仍需编程访问编译器的工具可让 TypeScript 6 与 7 并存。[Running Side-by-Side with TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0)
2. 官方点名 Vue、MDX、Astro、Svelte 工作流目前大概率无法使用 TypeScript 7，因为 Volar 等嵌入 TypeScript 的工具只能依赖 TypeScript 6.0。[TypeScript and Embedded Languages](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#typescript-and-embedded-languages)
3. 同一节随后直接建议这些项目“for now”继续使用 TypeScript 6.0，并说明这是时间点上的限制，团队会与相关维护者合作补足支持。因此准确表述是：**TypeScript 7.0 当前明确不支持完整的 Astro 嵌入式语言工作流；这是暂时状态，不代表未来版本不会支持。**[TypeScript and Embedded Languages](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#typescript-and-embedded-languages)
4. Astro 侧也能验证这一点：Astro 7.1.0 仓库内的 `@astrojs/check@0.9.9` peer range 是 `^5.0.0 || ^6.0.0`，并且它通过传统 TypeScript API 加载诊断服务；Astro 维护者在公开 issue 中说明，在 TypeScript 提供支持之前 Astro 无法修复。[`@astrojs/check@0.9.9`](https://github.com/withastro/astro/blob/astro%407.1.0/packages/language-tools/astro-check/package.json)；[`astro-check` source](https://github.com/withastro/astro/blob/astro%407.1.0/packages/language-tools/astro-check/src/index.ts)；[Astro issue #17268](https://github.com/withastro/astro/issues/17268#issuecomment-4926208574)

因此本项目应把 `typescript` 保留在最新的 6.0.x，而不是升级到 7.0。即使 TypeScript 7 的独立 `tsc` 能处理普通 `.ts` 文件，也不能据此认为 `astro check`、Astro 编辑器诊断或 `.astro` 模板类型检查已经兼容。
