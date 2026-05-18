import { expect, test } from "@playwright/test"

const articlePath = "/en/posts/20150714-agiot/"
const siteOrigin = "https://polyglow.realrip.com"

test.describe("content routes", () => {
  test("renders homepage, article, taxonomy, search, author, and 404 routes", async ({
    page,
  }) => {
    await page.goto("/en/")
    await expect(page).toHaveTitle(/Polyglow/)
    await expect(
      page.getByRole("link", { name: /Polyglow/ }).first()
    ).toBeVisible()
    await expect(
      page.locator("[data-home-surface] [data-glass-card]")
    ).toHaveCount(20)
    await expect(
      page.getByRole("navigation", { name: "Pagination" })
    ).toBeVisible()

    await page.goto(articlePath)
    await expect(page).toHaveTitle(/Agiotage and the Price of Trust/)
    await expect(page.locator("[data-pagefind-body]")).toHaveCount(1)
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .innerHTML()
    expect(jsonLd).toContain("BlogPosting")

    await page.goto("/en/category/invest/")
    await expect(
      page.getByRole("heading", { level: 1, name: "Invest", exact: true })
    ).toBeVisible()

    await page.goto("/en/tags/risk/")
    await expect(
      page.getByRole("heading", { level: 1, name: "Risk", exact: true })
    ).toBeVisible()

    await page.goto("/en/search/")
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow"
    )
    await page.locator(".pagefind-ui__search-input").fill("risk")
    await expect(page.locator(".pagefind-ui__result")).toHaveCount(4)
    const resultLinks = await page
      .locator(".pagefind-ui__result-link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    expect(resultLinks.every((href) => href?.startsWith("/en/posts/"))).toBe(
      true
    )

    await page.goto("/en/author/")
    await expect(
      page.getByRole("heading", { level: 1, name: "Author", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Polyglow Editorial" })
    ).toBeVisible()

    const response = await page.goto("/en/not-a-real-page/")
    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Page Not Found",
        exact: true,
      })
    ).toBeVisible()
  })
})

test.describe("article detail layout", () => {
  test("matches the Polyglow article structure", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto(articlePath)

    const hero = page.locator("[data-article-hero]")
    await expect(hero).toBeVisible()
    await expect(
      hero.getByRole("heading", { name: "Agiotage and the Price of Trust" })
    ).toBeVisible()

    const heroBox = await hero.boundingBox()
    expect(heroBox?.width).toBeGreaterThanOrEqual(740)
    expect(heroBox?.width).toBeLessThanOrEqual(780)

    const bodyMedia = page.locator("[data-pagefind-body] picture").first()
    const bodyMediaBox = await bodyMedia.boundingBox()
    expect(bodyMediaBox?.width).toBeGreaterThanOrEqual(740)
    expect(bodyMediaBox?.width).toBeLessThanOrEqual(780)
    expect(
      Math.abs((heroBox?.width ?? 0) - (bodyMediaBox?.width ?? 0))
    ).toBeLessThanOrEqual(4)

    await expect(page.locator("[data-related-posts]")).toBeVisible()
    await expect(page.locator("[data-article-nav-card]")).toHaveCount(0)
  })

  test("uses the compact article attribution and related post section", async ({
    page,
  }) => {
    await page.goto(articlePath)

    const meta = page.locator("[data-article-meta]")
    await expect(meta).toBeVisible()
    await expect(meta).toContainText("Published at: Nov 24, 2024")
    await expect(meta).toContainText("Modified at: Nov 24, 2024")

    const attribution = page.locator("[data-article-attribution]")
    await expect(attribution).toBeVisible()
    await expect(
      attribution.getByRole("link", {
        name: "Polyglow Editorial",
        exact: true,
      })
    ).toBeVisible()
    await expect(
      attribution.getByRole("link", { name: "Invest", exact: true })
    ).toBeVisible()

    await expect(page.locator("[data-article-nav-card]")).toHaveCount(0)
    await expect(
      page.locator("[data-related-posts] [data-glass-card]")
    ).toHaveCount(3)
  })

  test("keeps related article cards readable on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 })
    await page.goto(articlePath)

    const cards = page.locator("[data-related-posts] [data-glass-card]")
    await expect(cards).toHaveCount(3)
    const boxes = await cards.evaluateAll((items) =>
      items.map((item) => {
        const rect = item.getBoundingClientRect()
        return { width: rect.width, y: rect.y }
      })
    )

    expect(boxes[0]?.width).toBeGreaterThanOrEqual(300)
    expect(boxes[1]?.width).toBeGreaterThanOrEqual(300)
    expect(Math.round(boxes[0]?.y ?? 0)).toBe(Math.round(boxes[1]?.y ?? -1))
    expect(boxes[2]?.y).toBeGreaterThan((boxes[0]?.y ?? 0) + 10)
  })
})

test.describe("listing surfaces", () => {
  test("renders refined archive, category, and tag pages", async ({ page }) => {
    await page.goto("/en/posts/")
    let listingHeader = page.locator("[data-page-header]")
    await expect(
      listingHeader.getByRole("heading", {
        level: 1,
        name: "All Posts",
        exact: true,
      })
    ).toBeVisible()
    await expect(listingHeader).toContainText("20 posts in total")
    await expect(listingHeader.locator("[data-page-eyebrow]")).toHaveCount(0)
    await expect(listingHeader.locator("[data-page-stat]")).toHaveCount(0)
    await expect(page.locator(".archive-list .archive-row")).toHaveCount(20)
    await expect(
      page.getByRole("navigation", { name: "Pagination" })
    ).toHaveCount(0)

    await page.goto("/en/category/invest/")
    listingHeader = page.locator("[data-page-header]")
    await expect(
      listingHeader.getByRole("heading", {
        level: 2,
        name: "The art of capturing value, the dual logic of capital and industry",
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.getByRole("navigation", { name: "Related tags" })
    ).toHaveCount(0)

    await page.goto("/en/tags/risk/")
    listingHeader = page.locator("[data-page-header]")
    await expect(listingHeader.locator("[data-page-eyebrow]")).toHaveCount(0)
    await expect(listingHeader.locator("[data-page-stat]")).toHaveCount(0)
    await expect(
      listingHeader.getByRole("heading", {
        level: 2,
        name: "Risk and resilience.",
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.getByRole("navigation", { name: "Browse categories" })
    ).toHaveCount(0)
  })
})

test.describe("search surface", () => {
  test("renders the refined search page shell", async ({ page }) => {
    await page.goto("/en/search/")
    const pageHeader = page.locator("[data-page-header]")
    await expect(
      pageHeader.getByRole("heading", {
        level: 1,
        name: "Search",
        exact: true,
      })
    ).toBeVisible()
    await expect(
      pageHeader.getByRole("heading", {
        level: 2,
        name: "Search for content you're interested in",
        exact: true,
      })
    ).toBeVisible()

    const searchRegion = page.getByRole("search", { name: "Site search" })
    await expect(searchRegion).toBeVisible()
    await expect(
      searchRegion.locator(".pagefind-ui__search-input")
    ).toBeVisible()
    await expect(
      searchRegion.getByText("Search across posts and pages.", { exact: true })
    ).toHaveCount(0)

    const footerBox = await page.locator("footer").boundingBox()
    const viewport = page.viewportSize()
    if ((viewport?.width ?? 0) >= 768) {
      expect(Math.round((footerBox?.y ?? 0) + (footerBox?.height ?? 0))).toBe(
        viewport?.height
      )
    }
  })

  test("initializes Pagefind after localized client navigation", async ({
    page,
  }) => {
    await page.goto("/zh/")
    await page
      .locator("header")
      .locator('a[href="/zh/search/"][aria-label="Search"]')
      .click()
    await expect(page).toHaveURL(/\/zh\/search\/$/)

    const searchRegion = page.getByRole("search", { name: "Site search" })
    const searchInput = searchRegion.locator(".pagefind-ui__search-input")
    await expect(searchInput).toBeVisible()
    await searchInput.fill("风险")
    await expect(page.locator(".pagefind-ui__result")).toHaveCount(4)
    const resultLinks = await page
      .locator(".pagefind-ui__result-link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    expect(resultLinks.every((href) => href?.startsWith("/zh/posts/"))).toBe(
      true
    )
  })

  test("reinitializes Pagefind when switching search languages", async ({
    page,
  }) => {
    await page.goto("/ko/search/")
    const koreanInput = page.locator(".pagefind-ui__search-input")
    await expect(koreanInput).toBeVisible()
    await koreanInput.fill("risk")
    await expect(page.locator(".pagefind-ui__result").first()).toBeVisible()
    const koreanLinks = await page
      .locator(".pagefind-ui__result-link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    expect(koreanLinks.length).toBeGreaterThan(0)
    expect(koreanLinks.every((href) => href?.startsWith("/ko/posts/"))).toBe(
      true
    )

    await page.locator("[data-polyglow-menu-trigger]").first().click()
    await page.locator('a[href="/zh/search/"]').first().click()
    await expect(page).toHaveURL(/\/zh\/search\/$/)

    const chineseInput = page.locator(".pagefind-ui__search-input")
    await expect(chineseInput).toBeVisible()
    await chineseInput.fill("风险")
    await expect(page.locator(".pagefind-ui__result")).toHaveCount(4)
    const chineseLinks = await page
      .locator(".pagefind-ui__result-link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    expect(chineseLinks.length).toBeGreaterThan(0)
    expect(chineseLinks.every((href) => href?.startsWith("/zh/posts/"))).toBe(
      true
    )
  })
})

test.describe("localized UI and SEO", () => {
  test("renders localized search, not found, and article labels", async ({
    page,
  }) => {
    await page.goto("/zh/posts/")
    await expect(
      page.getByRole("heading", { level: 1, name: "所有文章", exact: true })
    ).toBeVisible()
    await expect(page.locator("[data-page-header]")).toContainText(
      "共 20 篇文章"
    )

    await page.goto("/zh/category/")
    await expect(
      page.getByRole("heading", { level: 1, name: "分类", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { level: 2, name: "浏览分类", exact: true })
    ).toBeVisible()

    await page.goto("/zh/tags/")
    await expect(
      page.getByRole("heading", { level: 1, name: "标签", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { level: 2, name: "浏览标签", exact: true })
    ).toBeVisible()

    await page.goto("/zh/author/")
    await expect(
      page.getByRole("heading", { level: 1, name: "作者", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { level: 2, name: "写作活跃度", exact: true })
    ).toBeVisible()

    await page.goto("/zh/search/")
    await expect(
      page.getByRole("heading", { level: 1, name: "搜索", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "搜索你感兴趣的内容",
        exact: true,
      })
    ).toBeVisible()

    await page.goto("/zh/404/")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "页面未找到",
        exact: true,
      })
    ).toBeVisible()
    await expect(page.getByText("搜索你感兴趣的内容")).toBeVisible()
    await expect(
      page.getByRole("link", { name: "返回首页", exact: true })
    ).toHaveAttribute("href", "/zh/")
    await expect(
      page.getByRole("link", { name: "浏览文章", exact: true })
    ).toBeVisible()

    const zhMissingResponse = await page.goto("/zh/not-a-real-page/")
    expect(zhMissingResponse?.status()).toBe(404)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "页面未找到",
        exact: true,
      })
    ).toBeVisible()
    const zhMissingSearch = page.getByRole("search", { name: "页面未找到" })
    await expect(
      zhMissingSearch.getByRole("searchbox", {
        name: "搜索你感兴趣的内容",
      })
    ).toHaveAttribute("placeholder", "搜索你感兴趣的内容")
    await expect(
      page.getByRole("button", { name: "搜索", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "返回首页", exact: true })
    ).toHaveAttribute("href", "/zh/")
    await expect(
      page.getByRole("link", { name: "浏览文章", exact: true })
    ).toHaveAttribute("href", "/zh/posts/")

    await page.goto("/zh/posts/20150714-agiot/")
    const articleMeta = page.locator("[data-article-meta]")
    await expect(articleMeta).toContainText("发布于")
    await expect(articleMeta).toContainText("修改于")
    await expect(
      page.getByRole("heading", { name: "相关文章", exact: true })
    ).toBeAttached()

    await page.goto("/ar/posts/20150714-agiot/")
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
    await expect(page.locator("[data-article-meta]")).toContainText("نشر في")
    await expect(
      page.getByRole("heading", { name: "مقالات ذات صلة", exact: true })
    ).toBeAttached()
    await expect(
      page.locator("[data-related-posts] [data-glass-card]")
    ).toHaveCount(3)

    const arMissingResponse = await page.goto("/ar/not-a-real-page/")
    expect(arMissingResponse?.status()).toBe(404)
    await expect(page.locator("html")).toHaveAttribute("lang", "ar")
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "الصفحة غير موجودة",
        exact: true,
      })
    ).toBeVisible()
    const arMissingSearch = page.getByRole("search", {
      name: "الصفحة غير موجودة",
    })
    await expect(
      arMissingSearch.getByRole("searchbox", {
        name: "ابحث عن المحتوى الذي يهمك",
      })
    ).toHaveAttribute("placeholder", "ابحث عن المحتوى الذي يهمك")
    await expect(
      page.getByRole("button", { name: "بحث", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "العودة للرئيسية", exact: true })
    ).toHaveAttribute("href", "/ar/")
    await expect(
      page.getByRole("link", { name: "تصفح المقالات", exact: true })
    ).toHaveAttribute("href", "/ar/posts/")

    await page.goto("/ja/category/build/")
    await expect(
      page.getByRole("heading", { level: 1, name: "構築", exact: true })
    ).toBeVisible()
    await expect(page.locator("[data-page-header]")).toContainText(
      "プロダクト、チーム、システム。"
    )

    await page.goto("/ar/tags/strategy/")
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
    await expect(
      page.getByRole("heading", { level: 1, name: "استراتيجية", exact: true })
    ).toBeVisible()
    await expect(page.locator("[data-page-header]")).toContainText(
      "تفكير استراتيجي."
    )
  })

  test("emits canonical, hreflang, Twitter, Open Graph, and JSON-LD metadata", async ({
    page,
  }) => {
    await page.goto(articlePath)

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${siteOrigin}/en/posts/20150714-agiot/`
    )
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]')
    ).toHaveAttribute("href", `${siteOrigin}/en/posts/20150714-agiot/`)
    await expect(
      page.locator('link[rel="alternate"][hreflang="zh"]')
    ).toHaveAttribute("href", `${siteOrigin}/zh/posts/20150714-agiot/`)
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article"
    )
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      /Agiotage and the Price of Trust/
    )
    await expect(
      page.locator('meta[name="twitter:description"]')
    ).toHaveAttribute(
      "content",
      "A concise invest note on agiotage and the price of trust, with attention to strategy, risk."
    )
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      /^https?:\/\//
    )

    const jsonLd = JSON.parse(
      await page.locator('script[type="application/ld+json"]').innerText()
    ) as Array<Record<string, unknown>>
    expect(jsonLd.map((item) => item["@type"])).toEqual(
      expect.arrayContaining(["WebSite", "WebPage", "BlogPosting"])
    )
  })
})

test.describe("auxiliary surfaces", () => {
  test("renders refined about, author, and not found pages", async ({
    page,
  }) => {
    await page.goto("/en/about/")
    await expect(page.locator("[data-about-page]")).toBeVisible()
    const aboutHeader = page.locator("[data-page-header]")
    await expect(
      aboutHeader.getByRole("heading", {
        level: 1,
        name: "About",
        exact: true,
      })
    ).toBeVisible()
    await expect(page.locator("[data-about-intro]")).toBeVisible()
    await expect(
      page.locator("[data-about-posts] [data-glass-card]")
    ).toHaveCount(3)

    await page.goto("/en/author/")
    await expect(page.locator("[data-author-card]")).toBeVisible()
    await expect(
      page.locator("[data-author-card]").getByRole("heading", {
        level: 2,
        name: "Polyglow Editorial",
        exact: true,
      })
    ).toBeVisible()
    await expect(
      page.getByRole("navigation", { name: "Author links" })
    ).toBeVisible()
    await expect(page.locator("[data-writing-activity]")).toBeVisible()
    await expect(page.locator("[data-writing-activity]")).toContainText(
      "12 posts published in 2024"
    )
    await expect(page.locator('[data-day="2024-12-24"]')).toHaveAttribute(
      "title",
      /: 1$/
    )
    await expect(page.locator('[data-day="2025-01-05"]')).toHaveCount(0)
    await expect(page.locator("[data-author-published-list]")).toContainText(
      "Published at:"
    )

    const response = await page.goto("/en/not-a-real-page/")
    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Page Not Found",
        exact: true,
      })
    ).toBeVisible()
    const notFoundSearch = page.getByRole("search", {
      name: /Page Not Found|Not found search/,
    })
    await expect(notFoundSearch).toBeVisible()
    const notFoundInput = notFoundSearch.getByRole("searchbox")
    await expect(notFoundInput).toBeVisible()
    await notFoundInput.fill("risk")
    await expect(notFoundInput).toHaveValue("risk")
    await expect(
      page.getByRole("link", { name: "Back to Home", exact: true })
    ).toHaveAttribute("href", "/en/")
    await expect(
      page.getByRole("link", { name: "Browse Posts", exact: true })
    ).toBeVisible()
  })
})

test.describe("site interactions", () => {
  test("keeps header actions keyboard accessible", async ({ page }) => {
    await page.goto("/en/")

    await expect(page.getByRole("link", { name: "Search" })).toHaveAttribute(
      "href",
      "/en/search/"
    )
    const headerPosition = await page
      .locator("header")
      .evaluate((element) => getComputedStyle(element).position)
    expect(headerPosition).not.toBe("fixed")
    expect(headerPosition).not.toBe("sticky")

    const themeButton = page.getByRole("button", { name: /Theme/ })
    await themeButton.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: /Dark/ })).toBeVisible()
    const systemThemeOption = page.getByRole("menuitem", {
      name: "System Default",
    })
    await expect(systemThemeOption).toBeVisible()
    await expect(systemThemeOption).toHaveAttribute("aria-current", "true")
    await expect(systemThemeOption).toHaveCSS("white-space", "nowrap")
    await page.keyboard.press("Escape")
    await expect(page.getByRole("menuitem", { name: /Dark/ })).toBeHidden()

    const languageButton = page.getByRole("button", { name: /Language/ })
    await languageButton.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: /Français/ })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("menuitem", { name: /Français/ })).toBeHidden()
  })

  test("switches theme and language on desktop", async ({ page }) => {
    await page.goto(articlePath)

    await page.getByRole("button", { name: "Theme" }).click()
    await page.getByRole("menuitem", { name: /Dark/ }).click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("dark")

    await page.getByRole("button", { name: "Theme" }).click()
    await page.getByRole("menuitem", { name: "System Default" }).click()
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBeNull()

    await page.getByRole("button", { name: "Language" }).click()
    await page.getByRole("menuitem", { name: /Français/ }).click()
    await expect(page).toHaveURL(/\/fr\/posts\/20150714-agiot\/$/)
  })

  test("links footer primary categories to category pages", async ({
    page,
  }) => {
    await page.goto("/en/")

    const footer = page.locator("footer")
    await expect(
      footer.getByRole("link", { name: "Build", exact: true })
    ).toHaveAttribute("href", "/en/category/build/")
    await expect(
      footer.getByRole("link", { name: "Invest", exact: true })
    ).toHaveAttribute("href", "/en/category/invest/")
    await expect(
      footer.getByRole("link", { name: "Life", exact: true })
    ).toHaveAttribute("href", "/en/category/life/")
    await expect(footer.getByRole("link", { name: "X" })).toHaveAttribute(
      "href",
      "https://x.com/idimilabs"
    )
    await expect(footer.getByRole("link", { name: "RSS" })).toHaveAttribute(
      "href",
      "/en/rss.xml"
    )
  })

  test("opens mobile navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/en/")

    await page.getByRole("button", { name: "Menu" }).click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await dialog.getByText("Invest").click()
    await expect(
      dialog.getByRole("link", { name: "Invest", exact: true })
    ).toHaveCount(0)
    await expect(
      dialog.getByRole("link", { name: "Strategy", exact: true })
    ).toBeVisible()
    await expect(dialog.getByRole("link", { name: "All Posts" })).toBeVisible()
    await expect(dialog.getByRole("link", { name: "Search" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
  })

  test("keeps mobile header brand and actions separated", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/en/")

    const header = page.locator("header")
    const brand = header.locator("[data-header-brand]")
    const actions = header.locator("[data-header-actions]")
    await expect(brand).toBeVisible()
    await expect(actions).toBeVisible()

    const [brandBox, actionsBox, headerBox] = await Promise.all([
      brand.boundingBox(),
      actions.boundingBox(),
      header.boundingBox(),
    ])
    expect(brandBox).not.toBeNull()
    expect(actionsBox).not.toBeNull()
    expect(headerBox).not.toBeNull()

    expect(Math.round(brandBox!.x - headerBox!.x)).toBe(16)
    expect(
      Math.round(
        headerBox!.x + headerBox!.width - (actionsBox!.x + actionsBox!.width)
      )
    ).toBe(16)
    expect(actionsBox!.x).toBeGreaterThanOrEqual(brandBox!.x + brandBox!.width)

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    )
    const innerWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  })
})

test.describe("performance budget", () => {
  test("keeps content pages free of Pagefind assets and within script budget", async ({
    page,
  }) => {
    const scriptResponses: Array<{ url: string; bytes: number }> = []
    page.on("response", async (response) => {
      const url = response.url()
      if (!url.includes("/_astro/") || !url.endsWith(".js")) return
      try {
        const body = await response.body()
        scriptResponses.push({ url, bytes: body.length })
      } catch {
        // Ignore browser-cached responses that no longer expose a body.
      }
    })

    await page.goto(articlePath, { waitUntil: "networkidle" })
    const loadedScripts = scriptResponses.map((entry) => entry.url)
    expect(loadedScripts.some((url) => url.includes("/pagefind/"))).toBe(false)
    const totalScriptBytes = scriptResponses.reduce(
      (sum, entry) => sum + entry.bytes,
      0
    )
    expect(totalScriptBytes).toBeLessThanOrEqual(20_000)
    expect(
      loadedScripts.some((url) => url.includes("ClientRouter"))
    ).toBeTruthy()
    expect(loadedScripts.some((url) => /\/page\.[^/]+\.js$/.test(url))).toBe(
      false
    )
  })
})

test.describe("AI-readable content surfaces", () => {
  test("serves llms indexes and article markdown endpoints", async ({
    request,
  }) => {
    const llms = await request.get("/llms.txt")
    expect(llms.ok()).toBe(true)
    expect(llms.headers()["content-type"]).toContain("text/plain")
    const llmsText = await llms.text()
    expect(llmsText).toContain("# Polyglow")
    expect(llmsText).toContain("https://polyglow.realrip.com/llms-full.txt")
    expect(llmsText).toContain(
      "https://polyglow.realrip.com/en/posts/20150714-agiot.md"
    )

    const full = await request.get("/llms-full.txt")
    expect(full.ok()).toBe(true)
    const fullText = await full.text()
    expect(fullText).toContain("# Polyglow full content index")
    expect(fullText).toContain("## en")
    expect(fullText).toContain("Agiotage and the Price of Trust")

    const markdown = await request.get("/en/posts/20150714-agiot.md")
    expect(markdown.ok()).toBe(true)
    expect(markdown.headers()["content-type"]).toContain("text/markdown")
    const articleMarkdown = await markdown.text()
    expect(articleMarkdown).toContain("# Agiotage and the Price of Trust")
    expect(articleMarkdown).toContain(
      'canonical: "https://polyglow.realrip.com/en/posts/20150714-agiot/"'
    )
    expect(articleMarkdown).toContain("## Overview")
    expect(articleMarkdown).not.toContain("<OptimizedPicture")
  })
})
