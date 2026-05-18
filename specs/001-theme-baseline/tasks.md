# 任务：Polyglow 主题基线

**输入**：`specs/001-theme-baseline/` 下的规格、计划、研究记录、数据模型、公开契约和快速开始。

**测试策略**：本功能采用测试先行。公开路由、SEO、内容 schema、图片、搜索、无障碍、JavaScript 加载和工程约束都通过 Vitest、Astro 诊断、静态构建或 Playwright 检查。

## Phase 1：准备（共享基础）

**目的**：完成 Spec Kit 文档和现有实现边界确认。

- [x] T001 确认功能规格保存在 specs/001-theme-baseline/spec.md
- [x] T002 确认需求清单保存在 specs/001-theme-baseline/checklists/requirements.md
- [x] T003 [P] 在 tests/project-hygiene.test.ts 增加 Spec Kit 工件完整性检查
- [x] T004 补齐实施计划 specs/001-theme-baseline/plan.md
- [x] T005 [P] 补齐研究记录 specs/001-theme-baseline/research.md
- [x] T006 [P] 补齐数据模型 specs/001-theme-baseline/data-model.md
- [x] T007 [P] 补齐快速开始 specs/001-theme-baseline/quickstart.md
- [x] T008 [P] 补齐公开站点契约 specs/001-theme-baseline/contracts/public-site.md
- [x] T009 补齐任务清单 specs/001-theme-baseline/tasks.md

## Phase 2：基础工作（阻塞前置）

**目的**：保证所有用户故事共享的架构约束已经存在。

- [x] T010 在 src/config/locales.ts 固定多语言配置、默认英文和 RTL 示例语言
- [x] T011 [P] 在 src/config/site.ts 固定 Polyglow 品牌、生产域名和仓库链接
- [x] T012 [P] 在 src/config/assets.ts 保留本地图片、public 图片和授权远程图片规则
- [x] T013 [P] 在 src/config/features.ts 保留可选集成开关
- [x] T014 在 src/content.config.ts 定义 posts、pages、authors 内容集合 schema
- [x] T015 在 src/utils/routes.ts、src/utils/structured-data.ts、src/utils/posts.ts 保持路由、结构化数据和文章查询 helper；页面 SEO 元数据由 astro-seo 输出
- [x] T016 在 astro.config.mjs 保持静态输出、Astro 图片、Pagefind、Sitemap、MDX、Lucide 图标和可选 Partytown

## Phase 3：用户故事 1 - 发布多语言博客（优先级：P1）

**目标**：读者可以在任意支持语言中浏览首页、文章、列表、分类、标签、作者、搜索、RSS 和 404 恢复页面。

**独立测试**：运行 `pnpm test`、`pnpm build` 和 `pnpm test:e2e:ci`，重点访问 `/:lang/`、文章页、分类页、标签页、搜索页、作者页和 404。

### 测试

- [x] T017 [P] [US1] 在 tests/content-quality.test.ts 检查内容质量和占位文本
- [x] T018 [P] [US1] 在 tests/e2e/content-site.spec.ts 检查首页、文章、分类、标签、搜索、作者和 404
- [x] T019 [P] [US1] 在 tests/project-hygiene.test.ts 检查首页和文章列表 20 篇、分类和标签 12 篇的分页策略

### 实现

- [x] T020 [P] [US1] 在 src/pages/[lang]/index.astro 实现本地化首页
- [x] T021 [P] [US1] 在 src/pages/[lang]/[page].astro 和 src/pages/[lang]/posts/[page].astro 实现分页列表
- [x] T022 [P] [US1] 在 src/pages/[lang]/posts/[slug].astro 实现文章页
- [x] T023 [P] [US1] 在 src/pages/[lang]/category/[slug]/[page].astro 和 src/pages/[lang]/tags/[slug]/[page].astro 实现分类与标签页
- [x] T024 [P] [US1] 在 src/pages/[lang]/about.astro 和 src/pages/[lang]/author.astro 实现 About 与 Author
- [x] T025 [P] [US1] 在 src/pages/[lang]/search.astro 和 src/pages/[lang]/404.astro 实现搜索与恢复页面
- [x] T026 [US1] 在 src/pages/[lang]/rss.xml.ts、src/pages/rss.xml.ts、src/pages/robots.txt.ts 和 Astro sitemap 集成中实现公开订阅与索引入口
- [x] T026a [US1] 在 src/pages/llms.txt.ts、src/pages/llms-full.txt.ts 和 src/pages/[lang]/posts/[slug].md.ts 实现静态 AI 可读内容入口

## Phase 4：用户故事 2 - 低门槛评估主题（优先级：P2）

**目标**：开源用户无需私有凭据即可安装、运行、修改和构建主题。

**独立测试**：运行 `pnpm install`、`pnpm dev`、`pnpm check`，并确认未配置 R2 或统计时构建不失败。

### 测试

- [x] T027 [P] [US2] 在 tests/project-hygiene.test.ts 检查 React、shadcn 和相关依赖已移除
- [x] T028 [P] [US2] 在 tests/project-hygiene.test.ts 检查 Partytown 只作为可选统计准备
- [x] T029 [P] [US2] 在 tests/project-hygiene.test.ts 检查 Lucide 通过 Astro Icon 使用
- [x] T030 [P] [US2] 在 tests/project-hygiene.test.ts 检查系统字体栈和 neutral 配色

### 实现

- [x] T031 [P] [US2] 在 package.json 保留 pnpm 脚本、Node 24 范围和必要依赖
- [x] T032 [P] [US2] 在 README.md 和 README-ZH.md 说明本地运行、构建和部署
- [x] T033 [P] [US2] 在 .env.example 保留生产域名和可选配置示例
- [x] T034 [US2] 在 src/components/icons/Icon.astro 和 astro.config.mjs 使用 Lucide 图标库
- [x] T035 [US2] 在 src/styles/global.css 使用系统字体、RTL 支持、中日韩正文两端排列和 Tailwind neutral 色系
- [x] T035a [US2] 在 src/styles/global.css 使用 `text-autospace` 改善中日韩与拉丁字母、数字混排间距

## Phase 5：用户故事 3 - 维护干净的发布系统（优先级：P3）

**目标**：维护者通过清晰门禁防止路由、SEO、搜索、图片、无障碍、性能和部署准备回归。

**独立测试**：运行 `pnpm check`；涉及视觉或交互时追加 `pnpm test:e2e:ci`。

### 测试

- [x] T036 [P] [US3] 在 tests/project-hygiene.test.ts 检查 CI、部署、架构和图片优化规则
- [x] T037 [P] [US3] 在 tests/e2e/content-site.spec.ts 检查 canonical、hreflang、OG、Twitter 和 JSON-LD
- [x] T038 [P] [US3] 在 tests/e2e/visual-regression.spec.ts 保留关键页面视觉基线

### 实现

- [x] T039 [P] [US3] 在 .github/workflows/ci.yml 保持轻量验证和 main 分支部署
- [x] T040 [P] [US3] 在 scripts/deploy-check.mjs 检查生产部署必要环境
- [x] T041 [P] [US3] 在 scripts/assets-check.mjs 检查远程图片约束
- [x] T042 [US3] 在 src/components/features/OptimizedPicture.astro 统一图片输出
- [x] T043 [US3] 在 src/components/features/Analytics.astro 保持统计配置后才加载

## Phase 6：收尾与验证

**目的**：确认规格、实现和验证命令处于同一状态。

- [x] T044 更新 AGENTS.md 中的 Spec Kit 计划引用
- [x] T045 运行 `pnpm vitest run tests/project-hygiene.test.ts --testNamePattern "Spec Kit"`
- [x] T046 运行 `pnpm test`
- [x] T047 运行 `pnpm lint`
- [x] T048 运行 `pnpm typecheck`
- [x] T049 运行 `pnpm build`
- [x] T050 按需要运行 `pnpm test:e2e:ci`
- [x] T051 提交并推送 main 分支

## 依赖与执行顺序

- Phase 1 和 Phase 2 完成后，三个用户故事可以分别验证。
- US1 是 MVP，先保证公开阅读路径完整。
- US2 在 US1 之后验证，确认主题采用者无需私有服务。
- US3 在 US1 和 US2 之后验证，确认维护门禁完整。
- Phase 6 是收尾门禁，必须在提交前完成。

## 并行机会

- T005、T006、T007、T008 可并行，因为分别修改不同规格文档。
- T010、T011、T012、T013 可并行，因为分别检查不同配置文件。
- T017、T018、T019 可并行，因为测试文件不同。
- T027、T028、T029、T030 可并行，因为验证目标不同。

## 实施策略

1. 以 US1 作为最小可交付范围，优先保护多语言公开阅读路径。
2. 补足 US2，确保开源采用者无需私有凭据即可运行主题。
3. 补足 US3，把发布检查、部署检查和视觉检查纳入常规流程。
4. 每次架构变化先补测试，再修改实现或文档。
