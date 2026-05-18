import expressiveCode from "astro-expressive-code"
import mdx from "@astrojs/mdx"
import partytown from "@astrojs/partytown"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import pagefind from "astro-pagefind"
import { defineConfig } from "astro/config"
import icon from "astro-icon"

const assetHost = (() => {
  if (!process.env.PUBLIC_ASSET_BASE_URL) return undefined
  try {
    const url = new URL(process.env.PUBLIC_ASSET_BASE_URL)
    return url.protocol === "https:" ? url.hostname : undefined
  } catch {
    return undefined
  }
})()

const googleAnalyticsId = process.env.PUBLIC_GOOGLE_ANALYTICS_ID

export default defineConfig({
  output: "static",
  site: process.env.PUBLIC_SITE_URL ?? "https://polyglow.realrip.com",
  trailingSlash: "always",
  build: {
    concurrency: 6,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["zh", "en", "fr", "es", "ru", "ja", "ko", "pt", "de", "id", "ar"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
    remotePatterns: [
      ...(assetHost ? [{ protocol: "https", hostname: assetHost }] : []),
      { protocol: "https", hostname: "*.unsplash.com" },
    ],
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6, alphaQuality: 80 },
        avif: { effort: 4, chromaSubsampling: "4:2:0" },
        png: { compressionLevel: 9 },
      },
    },
  },
  integrations: [
    icon({
      include: {
        lucide: [
          "arrow-left",
          "chevron-down",
          "github",
          "globe",
          "menu",
          "monitor",
          "moon",
          "newspaper",
          "rss",
          "search",
          "sun",
          "x",
        ],
      },
    }),
    ...(googleAnalyticsId
      ? [
          partytown({
            config: {
              forward: ["dataLayer.push"],
            },
          }),
        ]
      : []),
    expressiveCode({
      themes: ["github-dark", "github-light"],
      themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ""),
    }),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          zh: "zh-CN",
          en: "en-US",
          fr: "fr-FR",
          es: "es-ES",
          ru: "ru-RU",
          ja: "ja-JP",
          ko: "ko-KR",
          pt: "pt-PT",
          de: "de-DE",
          id: "id-ID",
          ar: "ar",
        },
      },
    }),
    mdx(),
    pagefind(),
  ],
})
