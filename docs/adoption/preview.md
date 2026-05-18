# 主题预览

本文档帮助采用者快速查看 Polyglow 的页面形态。主题默认提供首页、文章页、分类页、标签页、搜索页、About、Author 和 404 页面。

## 本地预览

```bash
pnpm install
pnpm dev
```

默认访问：

```text
http://localhost:4321/en/
```

## 首页布局

首页支持三种布局配置：

- `cover`：默认封面卡片首页，适合图像驱动的博客。
- `archive`：归档优先首页，适合长期写作和密集阅读。
- `text`：文字卡片首页，适合少图内容站。

配置位置：

```text
src/config/site.ts
```

修改：

```ts
homepage: {
  layout: "cover",
}
```

修改后重新运行 `pnpm dev`，刷新首页即可查看效果。
