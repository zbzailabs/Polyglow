# 最小内容模板

最小内容模板位于：

```text
examples/minimal-content/
```

模板包含：

```text
posts/en/hello-world.mdx
pages/en/about.md
authors/en/default.md
```

## 使用方式

预览将要复制的文件：

```bash
pnpm theme:reset
```

复制最小模板：

```bash
pnpm theme:reset -- --apply
```

完全替换现有内容目录：

```bash
pnpm theme:reset -- --apply --replace
```

## 模板字段

文章模板包含：

- `title`
- `description`
- `category`
- `tags`
- `pubDate`
- `authors`
- `heroImage`
- `heroImageAlt`
- `locale`
- `slug`

作者模板包含：

- `slug`
- `name`
- `bio`
- `socials`
- `locale`

About 模板包含：

- `title`
- `description`
- `locale`
- `slug`

## 后续修改

复制模板后，继续修改：

```text
src/config/site.ts
src/content/posts/en/hello-world.mdx
src/content/pages/en/about.md
src/content/authors/en/default.md
```

然后运行：

```bash
pnpm theme:check
pnpm theme:check
pnpm build
```
