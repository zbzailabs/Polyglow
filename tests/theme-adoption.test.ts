import { mkdir, mkdtemp, readFile, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

type ThemeCheckModule = typeof import("../scripts/theme-check.mjs")
type ThemeInitModule = typeof import("../scripts/theme-init.mjs")
type ThemeResetModule = typeof import("../scripts/theme-reset.mjs")

const read = (path: string) => readFile(path, "utf8")

describe("theme adoption scripts", () => {
  test("theme:check reports default identity values in the starter site", async () => {
    const { checkTheme } =
      (await import("../scripts/theme-check.mjs")) as ThemeCheckModule

    const result = await checkTheme({ root: process.cwd() })
    const rules = result.issues.map((issue) => issue.rule)

    expect(rules).toContain("ADOPT001")
    expect(rules).toContain("ADOPT002")
    expect(rules).toContain("ADOPT003")
    expect(rules).toContain("ADOPT004")
    expect(rules).toContain("ADOPT005")
    expect(rules).toContain("ADOPT006")
    expect(rules).toContain("ADOPT007")
    expect(rules).toContain("ADOPT008")
    expect(rules).toContain("ADOPT009")
  })

  test("theme:check passes on a customized minimal fixture", async () => {
    const { checkTheme } =
      (await import("../scripts/theme-check.mjs")) as ThemeCheckModule
    const { resetThemeContent } =
      (await import("../scripts/theme-reset.mjs")) as ThemeResetModule

    const root = await mkdtemp(join(tmpdir(), "polyglow-theme-check-"))
    await resetThemeContent({
      apply: true,
      root,
      templateDir: join(process.cwd(), "examples/minimal-content"),
    })
    await mkdir(join(root, "src/config"), { recursive: true })
    await mkdir(root, { recursive: true })

    await import("node:fs/promises").then(({ writeFile }) =>
      Promise.all([
        writeFile(
          join(root, "src/config/site.ts"),
          'export const SITE_CONFIG = { name: "Field Notes", url: "https://field-notes.example", repository: "https://github.com/example/field-notes" }\n'
        ),
        writeFile(
          join(root, "README.md"),
          "# Field Notes\n\nA customized content site.\n"
        ),
        writeFile(
          join(root, "readme-zh.md"),
          "# Field Notes\n\n已完成自定义配置。\n"
        ),
      ])
    )

    const result = await checkTheme({ root })

    expect(result.issues).toEqual([])
  })

  test("theme:reset copies the minimal content template only when apply is enabled", async () => {
    const { resetThemeContent } =
      (await import("../scripts/theme-reset.mjs")) as ThemeResetModule

    const root = await mkdtemp(join(tmpdir(), "polyglow-theme-reset-"))
    const templateDir = join(process.cwd(), "examples/minimal-content")

    const dryRun = await resetThemeContent({ root, templateDir })
    await expect(
      stat(join(root, "src/content/posts/en/hello-world.mdx"))
    ).rejects.toThrow()
    expect(dryRun.plannedFiles).toContain(
      "src/content/posts/en/hello-world.mdx"
    )

    const applied = await resetThemeContent({ apply: true, root, templateDir })
    expect(applied.writtenFiles).toContain(
      "src/content/posts/en/hello-world.mdx"
    )
    await expect(
      stat(join(root, "src/content/posts/en/hello-world.mdx"))
    ).resolves.toBeTruthy()
  })

  test("theme:init prepares and applies first-run identity edits", async () => {
    const { initializeTheme } =
      (await import("../scripts/theme-init.mjs")) as ThemeInitModule
    const { resetThemeContent } =
      (await import("../scripts/theme-reset.mjs")) as ThemeResetModule

    const root = await mkdtemp(join(tmpdir(), "polyglow-theme-init-"))
    await resetThemeContent({
      apply: true,
      root,
      templateDir: join(process.cwd(), "examples/minimal-content"),
    })
    await mkdir(join(root, "src/config"), { recursive: true })
    await import("node:fs/promises").then(({ writeFile }) =>
      writeFile(
        join(root, "src/config/site.ts"),
        `export const SITE_CONFIG = {
  name: "Polyglow",
  url: "https://polyglow.realrip.com",
  description: "A multilingual Astro content site with glassmorphism cards and static publishing.",
  repository: "https://github.com/realriplab/Polyglow-next",
}
`
      )
    )

    const options = {
      root,
      siteName: "Field Notes",
      siteUrl: "https://field-notes.example",
      repository: "https://github.com/example/field-notes",
      authorName: "Field Editor",
      authorBio: "Notes from the field.",
      aboutDescription: "A compact field notebook.",
    }

    const dryRun = await initializeTheme(options)
    expect(dryRun.applied).toBe(false)
    expect(dryRun.changedFiles).toContain("src/config/site.ts")
    await expect(read(join(root, "src/config/site.ts"))).resolves.toContain(
      "Polyglow"
    )

    const applied = await initializeTheme({ ...options, apply: true })
    expect(applied.applied).toBe(true)
    expect(applied.changedFiles).toContain("src/config/site.ts")
    await expect(read(join(root, "src/config/site.ts"))).resolves.toContain(
      "Field Notes"
    )
    await expect(
      read(join(root, "src/content/authors/en/default.md"))
    ).resolves.toContain("Field Editor")
    await expect(
      read(join(root, "src/content/pages/en/about.md"))
    ).resolves.toContain("A compact field notebook.")
  })
})

describe("minimal content templates", () => {
  test("include schema-compatible frontmatter", async () => {
    const post = await read("examples/minimal-content/posts/en/hello-world.mdx")
    const about = await read("examples/minimal-content/pages/en/about.md")
    const author = await read("examples/minimal-content/authors/en/default.md")

    expect(post).toContain('title: "Hello From Your New Site"')
    expect(post).toContain('category: "build"')
    expect(post).toContain('heroImage: "/open-graph.webp"')
    expect(post).toContain("locale: en")
    expect(about).toContain("locale: en")
    expect(author).toContain("slug: default")
    expect(author).not.toContain("Polyglow Editorial")
  })
})
