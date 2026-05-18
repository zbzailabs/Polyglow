# 实施计划：主题采用体验

**分支**：`main` | **日期**：2026-05-14 | **规格**：[spec.md](./spec.md)

**输入**：来自 `specs/003-theme-adoption/spec.md` 的功能规格

## 摘要

本阶段把 Polyglow 从“可发布的博客主题”推进到“fork 后能快速改造成个人站点”。计划聚焦四个结果：采用指南、最小内容模板、内容重置流程、主题检查流程，并以 `v1.0.0-beta.1` 发布准备作为收尾。

## 技术上下文

**语言/版本**：Astro 6 静态站点，TypeScript 6，Node.js 24，pnpm 11。

**主要依赖**：沿用现有 Astro、Tailwind CSS、MDX、Pagefind、Astro Icon、Vitest、Playwright 和 Wrangler；不新增运行时框架。

**存储**：Git 管理的内容文件、示例模板、文档和脚本；无应用数据库。

**测试**：Vitest 项目检查、脚本聚焦测试、内容质量检查、ESLint、Astro 诊断、静态构建、必要时运行 Playwright。

**目标平台**：本地开发、GitHub fork、GitHub Release、Cloudflare 静态部署。

**项目类型**：开源静态多语言博客主题。

**性能目标**：新增脚本和文档不影响普通页面运行时；最小内容构建后保持 Pagefind 索引生成成功。

**约束**：继续保持 Astro 原生；不得引入 CMS、登录、评论、会员、强制 R2、强制统计、强制远程对象存储；默认图片路径支持本地和 `public/`。

**规模/范围**：一套最小内容模板、两个主题辅助脚本、README 文档入口、beta 发布清单和测试门禁。

## 宪章检查

_门禁：Phase 0 研究前通过；Phase 1 设计后再次检查。_

- **Astro 优先的静态发布**：通过。本阶段只增加采用体验、脚本和文档，不改变运行时架构。
- **稳定的多语言内容架构**：通过。最小模板保留语言前缀和默认英文策略。
- **最小客户端 JavaScript**：通过。新增能力为 Node 脚本和文档，不进入浏览器页面。
- **SEO、无障碍和性能门禁**：通过。内容重置后仍验证构建、搜索和公开路由。
- **开源简洁性和可选集成**：通过。R2、统计和 Cloudflare 凭据继续保持可选。

## 项目结构

### 本功能文档

```text
specs/003-theme-adoption/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── scripts-and-docs.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### 预计源码结构

```text
docs/
├── adoption/
└── release/

examples/
└── minimal-content/

scripts/
├── theme-check.mjs
└── theme-reset.mjs

tests/
├── theme-adoption.test.ts
└── project-hygiene.test.ts
```

**结构决策**：采用者文档进入 `docs/adoption/`；最小内容模板进入 `examples/minimal-content/`；脚本进入 `scripts/`；测试进入 `tests/`。

## 复杂度记录

| 事项               | 必要原因                       | 简化边界                                         |
| ------------------ | ------------------------------ | ------------------------------------------------ |
| `theme:reset` 脚本 | 采用者需要快速替换大量示例内容 | 默认只复制最小模板，不删除用户未确认的自定义文件 |
| `theme:check` 脚本 | 发布前发现默认身份信息残留     | 只检查明确规则，不做复杂内容质量评分             |
| beta 发布清单      | 公开发布需要一致的版本信息     | 只准备 GitHub Release，不进入 npm 模板发布       |
