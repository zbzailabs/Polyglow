# 契约：主题采用脚本与文档

## `theme:check` 契约

命令：

```bash
pnpm theme:check
```

期望行为：

- 扫描站点配置、README、作者资料、About 页面和示例文章。
- 发现默认站点名、默认域名、默认作者、默认仓库链接和示例内容残留。
- 输出规则编号、文件路径、问题说明和修复建议。
- 没有问题时以 0 退出。
- 存在阻塞问题时以非 0 退出。

## `theme:reset` 契约

命令：

```bash
pnpm theme:reset
```

期望行为：

- 使用 `examples/minimal-content/` 作为模板来源。
- 生成或复制最小文章、About、作者资料和图片说明。
- 默认输出将要执行的变更和后续命令。
- 破坏性替换必须有显式确认方式。
- 完成后提示运行 `pnpm theme:check` 和 `pnpm build`。

## `theme:init` 契约

命令：

```bash
pnpm theme:init -- --site-name "Field Notes" --site-url "https://example.com"
```

期望行为：

- 默认执行 dry-run，只输出准备修改的文件。
- 接收站点名称、生产域名、仓库地址、作者名称、作者简介和 About 描述。
- 仅修改站点配置、默认作者资料和英文 About 页面。
- 带 `--apply` 时写入文件，完成后提示运行 `pnpm theme:check` 和 `pnpm build`。

## 采用文档契约

文档入口：

```text
docs/adoption/fork-guide.md
docs/adoption/minimal-content.md
docs/adoption/preview.md
docs/integrations/static-hosting.md
docs/content/authoring.md
docs/configuration/theme.md
docs/release/preflight.md
```

期望内容：

- fork 后最短路径。
- 文件修改清单。
- 最小内容说明。
- 预览截图、首页布局变体和静态部署说明。
- 常见错误和修复。
- 发布 fork 前检查命令。

## README 入口契约

`README.md` 和 `readme-zh.md` 必须能链接到：

- fork 指南。
- 最小内容说明。
- 主题检查说明。
- 主题初始化说明。
- 预览和静态部署说明。
- 内容写作、配置、预览、部署和反馈入口。
