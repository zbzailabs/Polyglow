import { describe, expect, it } from "vitest"
import { buildAlternates, localePath, normalizePath } from "@/utils/routes"

describe("route helpers", () => {
  it("normalizes paths with leading and trailing slashes", () => {
    expect(normalizePath("posts")).toBe("/posts/")
    expect(normalizePath("/posts/")).toBe("/posts/")
    expect(normalizePath("")).toBe("/")
  })

  it("builds locale-prefixed paths with trailing slashes", () => {
    expect(localePath("zh", "/")).toBe("/zh/")
    expect(localePath("en", "posts")).toBe("/en/posts/")
  })

  it("includes x-default in alternate links", () => {
    const alternates = buildAlternates("/posts/")

    expect(alternates["zh-CN"]).toBe("https://realrip.com/zh/posts/")
    expect(alternates["x-default"]).toBe("https://realrip.com/zh/posts/")
  })
})
