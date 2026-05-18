# 快速开始：主题采用体验

## 目标

验证下一阶段实现后，采用者能快速得到一个最小个人站点。

## 预期采用流程

```bash
pnpm install
pnpm theme:reset
pnpm theme:check
pnpm test
pnpm build
pnpm dev
```

## 验收路径

1. 阅读 `docs/adoption/fork-guide.md`。
2. 运行 `pnpm theme:reset`。
3. 修改站点名称、域名、作者和 About。
4. 运行 `pnpm theme:check`。
5. 运行 `pnpm test` 和 `pnpm build`。
6. 打开 `/en/`、`/en/posts/hello-world/`、`/en/about/`、`/en/author/`。

## 发布 beta 前检查

```bash
pnpm check
pnpm test:e2e:ci
```

然后确认：

- `CHANGELOG.md` 包含 `v1.0.0-beta.1`。
- Git tag 与 CHANGELOG 版本一致。
- GitHub Release notes 链接 README、fork 指南、最小内容说明和质量记录。
