import { describe, expect, it } from "vitest"

import { normalizeContentSlug } from "@/utils/content-slug"

describe("content slug helpers", () => {
  it("removes content extensions from generated content ids", () => {
    expect(normalizeContentSlug("zh/20210905-bei-exchange.md", "zh")).toBe(
      "20210905-bei-exchange"
    )
    expect(normalizeContentSlug("en/posts/example.mdx", "en")).toBe(
      "posts/example"
    )
    expect(normalizeContentSlug("fr/note.markdown", "fr")).toBe("note")
  })

  it("preserves extensionless file-based slugs", () => {
    expect(normalizeContentSlug("zh/20211120-gatsby-starter-glass", "zh")).toBe(
      "20211120-gatsby-starter-glass"
    )
  })
})
