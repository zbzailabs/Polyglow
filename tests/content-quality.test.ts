import { readFileSync } from "node:fs"
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

const read = (path: string) => readFileSync(path, "utf8")

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return walk(path)
    return path
  })

describe("content quality", () => {
  test("keeps English about and author copy in English", () => {
    const about = read("src/content/pages/en/about.md")
    const author = read("src/content/authors/en/default.md")

    expect(about).not.toMatch(/[\u4e00-\u9fff]/)
    expect(author).not.toMatch(/Add more details as needed|author bio/i)
  })

  test("keeps Chinese author copy ready for publication", () => {
    const author = read("src/content/authors/zh/default.md")

    expect(author).not.toContain("可以在此补充")
    expect(author).not.toContain("作者简介的中文版本")
  })

  test("removes legacy demo ownership markers from active source files", () => {
    const files = [
      ...walk("src/config"),
      ...walk("src/components"),
      ...walk("src/i18n"),
      ...walk("src/content/pages"),
      ...walk("src/content/authors"),
    ]

    const allowedSocialXUrl = "https://x.com/idimilabs"
    const text = files
      .map((file) => read(file))
      .join("\n")
      .replaceAll(allowedSocialXUrl, "")

    expect(text).not.toMatch(/idimilabs|chat\.idimi|inote\.xyz|iNote/i)
  })

  test("keeps published posts free of starter placeholder copy", () => {
    const posts = walk("src/content/posts")
    const text = posts.map((file) => read(file)).join("\n")

    expect(text).not.toMatch(
      /Placeholder Title|Judul Placeholder|占位符标题|placeholder article|artigo placeholder|artículo placeholder|占位符文章|Lorem ipsum/i
    )
    expect(text).not.toMatch(
      /This is a brief placeholder description|deskripsi placeholder singkat|简要占位符描述|Placeholder image description|占位符图片背景描述/i
    )
    expect(text).not.toMatch(
      /Hello World|你好世界|First item|Second item|Third item/i
    )
  })

  test("keeps minimal content templates schema-compatible", () => {
    const post = read("examples/minimal-content/posts/en/hello-world.mdx")
    const about = read("examples/minimal-content/pages/en/about.md")
    const author = read("examples/minimal-content/authors/en/default.md")

    expect(post).toContain('title: "Hello From Your New Site"')
    expect(post).toContain('category: "build"')
    expect(post).toContain('heroImage: "/open-graph.webp"')
    expect(post).toContain("locale: en")
    expect(about).toContain("locale: en")
    expect(author).toContain("slug: default")
    expect(author).not.toContain("Polyglow Editorial")
  })
})
