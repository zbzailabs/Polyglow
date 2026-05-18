import { describe, expect, test } from "vitest"
import { readFileSync } from "node:fs"

import {
  DEFAULT_LOCALE,
  LOCALES,
  getLocaleMeta,
  isLocale,
} from "@/config/locales"
import {
  ASSET_CONFIG,
  isAllowedRemoteImage,
  optimizeRemoteImageUrl,
  resolveImageSource,
} from "@/config/assets"
import { getCategory, getTag, TAXONOMY } from "@/config/taxonomy"
import { buildAlternates, canonicalUrl, localePath } from "@/utils/routes"
import {
  articleJsonLd,
  webPageJsonLd,
  webSiteJsonLd,
} from "@/utils/structured-data"

const SITE_ORIGIN = "https://polyglow.realrip.com"

describe("locale configuration", () => {
  test("uses English as the prefixed default locale", () => {
    expect(DEFAULT_LOCALE).toBe("en")
    expect(LOCALES).toEqual([
      "zh",
      "en",
      "fr",
      "es",
      "ru",
      "ja",
      "ko",
      "pt",
      "de",
      "id",
      "ar",
    ])
    expect(isLocale("ja")).toBe(true)
    expect(isLocale("ar")).toBe(true)
    expect(getLocaleMeta("zh").ogLocale).toBe("zh_CN")
    expect(getLocaleMeta("ar").ogLocale).toBe("ar_AR")
    expect(getLocaleMeta("ar").dir).toBe("rtl")
  })
})

describe("route helpers", () => {
  test("builds locale-prefixed routes and canonical URLs", () => {
    expect(localePath("en", "/posts/example/")).toBe("/en/posts/example/")
    expect(localePath("zh", "category/invest")).toBe("/zh/category/invest/")
    expect(canonicalUrl("en", "/posts/example/")).toBe(
      `${SITE_ORIGIN}/en/posts/example/`
    )
  })

  test("builds self, locale, and x-default alternates", () => {
    const alternates = buildAlternates("/posts/example/")

    expect(alternates.en).toBe(`${SITE_ORIGIN}/en/posts/example/`)
    expect(alternates.zh).toBe(`${SITE_ORIGIN}/zh/posts/example/`)
    expect(alternates["x-default"]).toBe(`${SITE_ORIGIN}/en/posts/example/`)
  })

  test("keeps Cloudflare root redirect to English", () => {
    const redirects = readFileSync("public/_redirects", "utf8")

    expect(redirects).toContain("/ /en/ 301")
  })
})

describe("taxonomy", () => {
  test("centralizes categories and tags with localized labels", () => {
    expect(TAXONOMY.categories.length).toBeGreaterThan(0)
    expect(getCategory("invest")?.labelByLocale.en).toBe("Invest")
    expect(getCategory("invest")?.labelByLocale.ja).toBe("投資")
    expect(getCategory("build")?.labelByLocale.ar).toBe("البناء")
    expect(getCategory("startup")?.labelByLocale.ko).toBe("스타트업")
    expect(getTag("strategy")?.labelByLocale.zh).toBeTruthy()
    expect(getTag("strategy")?.labelByLocale.ja).toBe("戦略")
    expect(getTag("market")?.labelByLocale.ar).toBe("السوق")
    expect(getTag("risk")?.descriptionByLocale.de).toBe("Risiko und Resilienz.")
  })
})

describe("asset configuration", () => {
  test("keeps first-party remote assets disabled until explicitly configured", () => {
    expect(ASSET_CONFIG.publicAssetBaseUrl).toBe("")
    expect(
      isAllowedRemoteImage(
        "https://assets.example.com/posts/en/demo/cover.avif"
      )
    ).toBe(false)
    expect(isAllowedRemoteImage("https://images.unsplash.com/photo-123")).toBe(
      true
    )
    expect(isAllowedRemoteImage("https://example.invalid/image.jpg")).toBe(
      false
    )
  })

  test("resolves local, public, and remote image source kinds", () => {
    expect(resolveImageSource("/images/cover.jpg").kind).toBe("public")
    expect(resolveImageSource("src/assets/cover.jpg").kind).toBe("asset")
    expect(() =>
      resolveImageSource("https://assets.example.com/site/logo.avif")
    ).toThrow("Remote image host is not allowed")
  })

  test("adds lightweight delivery parameters to Unsplash placeholders", () => {
    expect(
      optimizeRemoteImageUrl("https://images.unsplash.com/photo-123", 1600)
    ).toBe(
      "https://images.unsplash.com/photo-123?auto=format&fit=crop&w=720&q=65"
    )
    expect(
      optimizeRemoteImageUrl("https://assets.example.com/image.avif", 1200)
    ).toBe("https://assets.example.com/image.avif")
  })
})

describe("SEO helpers", () => {
  test("emits WebSite JSON-LD with search action", () => {
    const json = webSiteJsonLd("en")

    expect(json["@type"]).toBe("WebSite")
    expect(json.url).toBe(`${SITE_ORIGIN}/en/`)
    expect(json.potentialAction).toMatchObject({
      "@type": "SearchAction",
      target: `${SITE_ORIGIN}/en/search/?q={search_term_string}`,
    })
  })

  test("emits WebPage JSON-LD with canonical identity", () => {
    const json = webPageJsonLd({
      lang: "en",
      path: "/about/",
      title: "About",
      description: "About Polyglow",
    })

    expect(json["@type"]).toBe("WebPage")
    expect(json["@id"]).toBe(`${SITE_ORIGIN}/en/about/#webpage`)
    expect(json.url).toBe(`${SITE_ORIGIN}/en/about/`)
    expect(json.isPartOf).toEqual({
      "@id": `${SITE_ORIGIN}/en/#website`,
    })
  })

  test("emits Article JSON-LD with canonical identity, publisher, and author array", () => {
    const json = articleJsonLd({
      lang: "en",
      path: "/posts/example/",
      title: "Example",
      description: "Example description",
      image: "/images/example-cover.avif",
      pubDate: new Date("2026-05-11T00:00:00Z"),
      updatedDate: new Date("2026-05-12T00:00:00Z"),
      authors: [
        {
          name: "Polyglow",
          url: `${SITE_ORIGIN}/en/author/`,
        },
      ],
    })

    expect(json["@type"]).toBe("BlogPosting")
    expect(json.url).toBe(`${SITE_ORIGIN}/en/posts/example/`)
    expect(json.image).toEqual([`${SITE_ORIGIN}/images/example-cover.avif`])
    expect(json.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}/en/posts/example/`,
    })
    expect(json.publisher).toMatchObject({
      "@type": "Organization",
      name: "Polyglow",
      url: SITE_ORIGIN,
    })
    expect(json.author).toEqual([
      {
        "@type": "Person",
        name: "Polyglow",
        url: `${SITE_ORIGIN}/en/author/`,
      },
    ])
    expect(json.dateModified).toBe("2026-05-12T00:00:00.000Z")
  })
})
