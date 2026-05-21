export type HomepageLayout = "cover" | "archive" | "text"

function normalizeGoogleTagManagerId(value: string | undefined): string {
  const id = (value ?? "").trim()
  return /^GTM-[A-Z0-9]+$/i.test(id) ? id.toUpperCase() : ""
}

function normalizeGoogleAdsenseClientId(value: string | undefined): string {
  const id = (value ?? "").trim()
  return /^ca-pub-\d+$/i.test(id) ? id : ""
}

function normalizePublicString(value: string | undefined): string {
  return (value ?? "").trim()
}

const googleTagManagerId = normalizeGoogleTagManagerId(
  import.meta.env.PUBLIC_GTM_ID
)
const googleAdsenseClientId = normalizeGoogleAdsenseClientId(
  import.meta.env.PUBLIC_ADSENSE_CLIENT_ID
)
const x402PayTo = normalizePublicString(import.meta.env.PUBLIC_X402_PAY_TO)
const x402Network = normalizePublicString(
  import.meta.env.PUBLIC_X402_NETWORK ??
    "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
)
const x402Price = normalizePublicString(
  import.meta.env.PUBLIC_X402_PRICE ?? "$0.01"
)
const x402Description = normalizePublicString(
  import.meta.env.PUBLIC_X402_DESCRIPTION ??
    "Voluntary x402 payment support for Polyglow content."
)
const x402FacilitatorUrl = normalizePublicString(
  import.meta.env.PUBLIC_X402_FACILITATOR_URL
)
const socialXUrl = "https://x.com/realriplabs"
const socialXHandle = `@${
  new URL(socialXUrl).pathname.split("/").filter(Boolean)[0] ?? "realriplabs"
}`

export const SITE_CONFIG = {
  name: "Polyglow",
  url: (
    import.meta.env.PUBLIC_SITE_URL ?? "https://polyglow.realrip.com"
  ).replace(/\/$/, ""),
  description:
    "Polyglow is a multilingual Astro content theme for essays, research notes, and knowledge archives with fast static pages, search, RSS, and SEO structure.",
  repository: "https://github.com/realriplab/Polyglow",
  social: {
    x: socialXUrl,
    xHandle: socialXHandle,
  },
  defaultOgImage: "/open-graph.webp",
  homepage: {
    layout: "cover" as HomepageLayout,
  },
  analytics: {
    googleTagManager: {
      enabled: import.meta.env.PUBLIC_GTM_ENABLED === "true",
      containerId: googleTagManagerId,
    },
    googleAdsense: {
      enabled: import.meta.env.PUBLIC_ADSENSE_ENABLED === "true",
      clientId: googleAdsenseClientId,
    },
  },
  payments: {
    x402: {
      enabled: import.meta.env.PUBLIC_X402_ENABLED === "true",
      payTo: x402PayTo,
      network: x402Network,
      price: x402Price,
      description: x402Description,
      facilitatorUrl: x402FacilitatorUrl,
    },
  },
}
