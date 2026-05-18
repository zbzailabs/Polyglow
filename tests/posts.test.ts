import { describe, expect, test } from "vitest"

import { selectAdjacentPosts, selectRelatedPosts } from "@/utils/post-navigation"

type TestPost = {
  id: string
  data: {
    locale: "en" | "zh"
    title: string
    category: string
    tags: string[]
    pubDate: Date
  }
}

const post = (id: string, pubDate: string, category = "build", tags: string[] = [], locale: "en" | "zh" = "en"): TestPost => ({
  id,
  data: {
    locale,
    title: id,
    category,
    tags,
    pubDate: new Date(pubDate),
  },
})

describe("post navigation helpers", () => {
  test("selects newer and older adjacent posts from a newest-first list", () => {
    const posts = [
      post("latest", "2024-12-24"),
      post("current", "2024-12-23"),
      post("older", "2024-12-14"),
    ]

    expect(selectAdjacentPosts(posts, posts[1])).toEqual({
      newer: posts[0],
      older: posts[2],
    })
  })

  test("selects related posts by category and shared tags without crossing locales", () => {
    const current = post("current", "2024-12-23", "build", ["strategy", "model"])
    const sameCategoryAndTag = post("same-category-tag", "2024-12-22", "build", ["strategy"])
    const sameCategory = post("same-category", "2024-12-21", "build", ["media"])
    const sameTag = post("same-tag", "2024-12-20", "life", ["model"])
    const otherLocale = post("other-locale", "2024-12-19", "build", ["strategy"], "zh")

    expect(selectRelatedPosts([current, sameTag, sameCategory, otherLocale, sameCategoryAndTag], current, 3)).toEqual([
      sameCategoryAndTag,
      sameCategory,
      sameTag,
    ])
  })
})
