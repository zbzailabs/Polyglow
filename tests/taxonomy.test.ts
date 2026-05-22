import { describe, expect, it } from "vitest"
import { normalizeCategorySlug, normalizeTagSlug } from "@/config/taxonomy"

describe("taxonomy normalization", () => {
  it("normalizes category labels and legacy variants to canonical slugs", () => {
    expect(normalizeCategorySlug("建设")).toBe("build")
    expect(normalizeCategorySlug("创业")).toBe("build")
    expect(normalizeCategorySlug("投资")).toBe("invest")
    expect(normalizeCategorySlug("生活")).toBe("life")
    expect(normalizeCategorySlug("Investment")).toBe("invest")
    expect(normalizeCategorySlug("Entrepreneurship")).toBe("build")
    expect(normalizeCategorySlug("Startups")).toBe("build")
    expect(normalizeCategorySlug("スタートアップ")).toBe("build")
    expect(normalizeCategorySlug("Инвестиции")).toBe("invest")
    expect(normalizeCategorySlug("人生")).toBe("life")
  })

  it("normalizes localized tag labels to canonical slugs", () => {
    expect(normalizeTagSlug("策略")).toBe("strategy")
    expect(normalizeTagSlug("配置")).toBe("allocation")
    expect(normalizeTagSlug("Reflect")).toBe("reflect")
    expect(normalizeTagSlug("Innovation")).toBe("innovation")
  })
})
