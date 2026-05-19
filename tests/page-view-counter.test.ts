import { describe, expect, test } from "vitest"

import {
  formatPageViewCount,
  isPageViewsEnabled,
} from "../src/utils/page-view-counter"

describe("formatPageViewCount", () => {
  test("formats only the numeric text next to the project eye icon", () => {
    expect(formatPageViewCount(1234)).toBe("1,234")
    expect(formatPageViewCount(1234)).not.toContain("👁️")
    expect(formatPageViewCount(1234)).not.toContain("浏览量")
    expect(formatPageViewCount(1234)).not.toContain(" ")
  })
})

describe("isPageViewsEnabled", () => {
  test("only enables page views when explicitly set to true", () => {
    expect(isPageViewsEnabled(undefined)).toBe(false)
    expect(isPageViewsEnabled("")).toBe(false)
    expect(isPageViewsEnabled("false")).toBe(false)
    expect(isPageViewsEnabled("1")).toBe(false)
    expect(isPageViewsEnabled("true")).toBe(true)
  })
})
