# 任务：主题采用体验

**输入**：`specs/003-theme-adoption/` 下的规格、计划、研究记录、数据模型、契约和快速开始。

**测试策略**：新增脚本和文档入口采用测试先行。默认值检查、最小内容模板、README 链接和发布清单均通过 Vitest 或项目卫生测试保护。

## Phase 1：准备

**目的**：为采用体验建立目录、测试入口和命令约束。

- [x] T001 在 tests/theme-adoption.test.ts 增加 `theme:check` 默认值残留检测的失败用例
- [x] T002 [P] 在 tests/project-hygiene.test.ts 增加 README 采用入口和 beta 发布文档入口检查
- [x] T003 [P] 在 package.json 添加待实现脚本名 `theme:check` 和 `theme:reset`
- [x] T004 [P] 建立 docs/adoption/ 目录并新增文档占位入口
- [x] T005 [P] 建立 examples/minimal-content/ 目录并新增模板说明

## Phase 2：基础能力

**目的**：完成脚本共享规则和最小模板结构。

- [x] T006 在 scripts/theme-check.mjs 实现检查规则数据结构和 CLI 输出格式
- [x] T007 [P] 在 examples/minimal-content/posts/en/hello-world.mdx 增加最小文章模板
- [x] T008 [P] 在 examples/minimal-content/pages/en/about.md 增加最小 About 模板
- [x] T009 [P] 在 examples/minimal-content/authors/en/default.md 增加最小作者模板
- [x] T010 在 scripts/theme-reset.mjs 实现保守复制流程和变更摘要输出

## Phase 3：用户故事 1 - 十分钟完成主题改造（P1）

**目标**：采用者能根据短指南完成必须配置并通过主题检查。

**独立测试**：运行 `pnpm theme:check`，确认默认配置残留能被报告；修改测试夹具后命令退出成功。

### 测试

- [x] T011 [P] [US1] 在 tests/theme-adoption.test.ts 增加站点名、生产域名、作者和仓库链接默认值检测
- [x] T012 [P] [US1] 在 tests/project-hygiene.test.ts 检查 docs/adoption/fork-guide.md 被 README.md 和 readme-zh.md 引用

### 实现

- [x] T013 [US1] 在 docs/adoption/fork-guide.md 编写 fork 后十分钟改造指南
- [x] T014 [US1] 在 scripts/theme-check.mjs 增加默认站点信息和默认作者检查
- [x] T015 [US1] 在 README.md 和 readme-zh.md 增加 fork 指南入口
- [x] T016 [US1] 运行 `pnpm theme:check`、`pnpm test` 验证用户故事 1

## Phase 4：用户故事 2 - 一键获得最小内容模板（P2）

**目标**：采用者能用最小模板替换示例内容，并保持站点可构建。

**独立测试**：在临时目录运行重置流程，确认最小内容文件生成，随后运行内容相关测试。

### 测试

- [x] T017 [P] [US2] 在 tests/theme-adoption.test.ts 增加 `theme:reset` 最小内容复制测试
- [x] T018 [P] [US2] 在 tests/content-quality.test.ts 增加最小模板 frontmatter 合规检查

### 实现

- [x] T019 [US2] 在 docs/adoption/minimal-content.md 编写最小内容模板说明
- [x] T020 [US2] 在 scripts/theme-reset.mjs 增加 dry-run 和显式确认参数
- [x] T021 [US2] 在 README.md 和 readme-zh.md 增加最小内容入口
- [x] T022 [US2] 运行 `pnpm theme:reset`、`pnpm test`、`pnpm build` 验证用户故事 2

## Phase 5：用户故事 3 - 发布 beta 版本（P3）

**目标**：维护者能准备 `v1.0.0-beta.1` 发布说明和 tag 检查。

**独立测试**：运行发布检查，确认 CHANGELOG、发布说明草稿和 tag 计划使用同一版本号。

### 测试

- [x] T023 [P] [US3] 在 tests/project-hygiene.test.ts 增加 beta 发布文档和 CHANGELOG 版本一致性检查

### 实现

- [x] T024 [US3] 在 CHANGELOG.md 保留 `v1.0.0-beta.1` 发布记录
- [x] T025 [US3] 在 CHANGELOG.md 完善 beta 发布条目
- [x] T026 [US3] 运行 `pnpm check` 和 `pnpm test:e2e:ci` 验证用户故事 3

## Phase 6：收尾

**目的**：确认计划、实现、文档和验证结果完整。

- [x] T027 更新公开文档入口，标记主题采用体验进入可用状态
- [x] T028 运行 `pnpm lint`
- [x] T029 运行 `pnpm test`
- [x] T030 运行 `pnpm check`
- [x] T031 按需要运行 `pnpm test:e2e:ci`
- [x] T032 提交并推送 main 分支

## Phase 7：复用与采用体验补强

**目的**：补齐用户角度和开发者角度的后续完善项，增强主题复用、预览、发布和维护体验。

- [x] T033 [P] 增加 `theme:init` dry-run/显式写入脚本，降低 fork 后首次改造成本
- [x] T034 [P] 删除不再面向采用者的聚合发布检查脚本和 beta 发布草稿
- [x] T035 [P] 增加预览、静态托管、写作、配置和反馈文档入口
- [x] T036 [P] 将归档、分类、标签、作者和页脚可见文案接入 i18n 字典
- [x] T037 [P] 为首页增加 `cover`、`archive`、`text` 三种布局配置
- [x] T038 [P] 更新 README、中文 README、fork 指南、主题配置和 roadmap，说明新增采用路径
- [x] T039 [P] 增加主题采用、项目卫生和端到端测试，保护脚本、文档、组件和本地化边界

## Phase 8：用户入口减负

**目的**：从 fork 用户视角收敛公开说明，只保留写作、配置、预览、部署和反馈所需内容。

- [x] T040 重写 README.md 和 readme-zh.md，移除测试、CI、Spec Kit、发布过程和组件内部说明
- [x] T041 删除 release-check 脚本、beta 发布草稿、质量过程记录、路线图、组件边界说明和 Spec Kit 开发流程说明
- [x] T042 更新发布前检查、预览、Cloudflare 和静态托管文档，改为用户发布站点所需步骤
- [x] T043 更新项目卫生测试，防止用户入口重新暴露内部开发过程链接

## 依赖与执行顺序

- Phase 1 和 Phase 2 先完成，随后进入用户故事。
- 用户故事 1 是最小可交付范围。
- 用户故事 2 依赖最小模板结构。
- 用户故事 3 依赖前两个故事的文档和验证结果。
- Phase 6 在全部选定故事完成后执行。

## 并行机会

- T002、T004、T005 可并行。
- T007、T008、T009 可并行。
- T011、T012 可并行。
- T017、T018 可并行。

## 实施策略

1. 先让 `theme:check` 能发现默认配置残留。
2. 再让 `theme:reset` 生成最小内容模板。
3. 最后补 beta 发布说明和 tag 检查。
4. 每个用户故事完成后运行对应最小验证命令。
