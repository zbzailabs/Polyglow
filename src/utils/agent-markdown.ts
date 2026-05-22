import { DEFAULT_LOCALE, LOCALES } from "@/config/locales"
import { SITE_CONFIG } from "@/config/site"
import { getCategory, getTag } from "@/config/taxonomy"
import {
  postCategorySlug,
  postTagSlugs,
  postUrl,
  type PostEntry,
} from "@/utils/posts"

function canonicalPostUrl(post: PostEntry): string {
  return `${SITE_CONFIG.url}${postUrl(post)}`
}

export function renderLlmsTxt(posts: readonly PostEntry[]): string {
  const latestPosts = posts.slice(0, 12)

  return [
    `# ${SITE_CONFIG.name}`,
    "",
    `> ${SITE_CONFIG.description}`,
    "",
    `Site: ${SITE_CONFIG.url}`,
    `Default locale: ${DEFAULT_LOCALE}`,
    `Locales: ${LOCALES.join(", ")}`,
    "",
    "## Entry points",
    "",
    `- [Home](${SITE_CONFIG.url}/${DEFAULT_LOCALE}/)`,
    `- [Search](${SITE_CONFIG.url}/${DEFAULT_LOCALE}/search/)`,
    `- [All posts](${SITE_CONFIG.url}/${DEFAULT_LOCALE}/posts/)`,
    `- [Full content index](${SITE_CONFIG.url}/llms-full.txt)`,
    "",
    "## Recent posts",
    "",
    ...latestPosts.map(
      (post) =>
        `- [${post.data.title}](${canonicalPostUrl(post)}) - ${post.data.description}`
    ),
    "",
  ].join("\n")
}

export function renderLlmsFullTxt(posts: readonly PostEntry[]): string {
  const lines = [
    "# Polyglow full content index",
    "",
    `Site: ${SITE_CONFIG.url}`,
    `Generated from ${posts.length} published posts.`,
    "",
  ]

  for (const locale of LOCALES) {
    const localePosts = posts.filter((post) => post.data.locale === locale)
    lines.push(`## ${locale}`, "")

    for (const post of localePosts) {
      const categorySlug = postCategorySlug(post)
      const category = getCategory(categorySlug)
      const tags = postTagSlugs(post)
        .map((tag) => getTag(tag)?.labelByLocale[locale] ?? tag)
        .join(", ")
      lines.push(
        `- [${post.data.title}](${canonicalPostUrl(post)})`,
        `  - Description: ${post.data.description}`,
        `  - Category: ${category?.labelByLocale[locale] ?? categorySlug}`,
        `  - Tags: ${tags || "None"}`,
        `  - Published: ${post.data.pubDate.toISOString().slice(0, 10)}`
      )
    }

    lines.push("")
  }

  return lines.join("\n")
}
