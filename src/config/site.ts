export type HomepageLayout = "cover" | "archive" | "text"

export const SITE_CONFIG = {
  name: "Polyglow",
  url: (
    import.meta.env.PUBLIC_SITE_URL ?? "https://polyglow.realrip.com"
  ).replace(/\/$/, ""),
  description:
    "A multilingual Astro content site with glassmorphism cards and static publishing.",
  repository: "https://github.com/realriplab/Polyglow-next",
  social: {
    x: "https://x.com/idimilabs",
  },
  defaultOgImage: "/open-graph.webp",
  homepage: {
    layout: "cover" as HomepageLayout,
  },
}
