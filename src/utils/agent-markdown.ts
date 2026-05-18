import { DEFAULT_LOCALE, LOCALES } from "@/config/locales"
import { SITE_CONFIG } from "@/config/site"
import { getCategory, getTag } from "@/config/taxonomy"
import { postSlug, postUrl, type PostEntry } from "@/utils/posts"

const quote = (value: string) => JSON.stringify(value)

const isoDate = (date: Date) => date.toISOString()

function markdownUrl(post: PostEntry): string {
  return `${SITE_CONFIG.url}/${post.data.locale}/posts/${postSlug(post)}.md`
}

function canonicalPostUrl(post: PostEntry): string {
  return `${SITE_CONFIG.url}${postUrl(post)}`
}

function cleanMdxBody(body = ""): string {
  return body
    .replace(/^import\s.+$/gm, "")
    .replace(/<OptimizedPicture\s+([\s\S]*?)\/>/g, (_, attrs: string) => {
      const src = attrs.match(/\bsrc="([^"]+)"/)?.[1] ?? ""
      const alt = attrs.match(/\balt="([^"]*)"/)?.[1] ?? ""
      return src ? `![${alt}](${src})` : ""
    })
    .replace(/<([A-Z][\w.]*)\b[\s\S]*?\/>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export function renderPostMarkdown(post: PostEntry): string {
  const category = getCategory(post.data.category)
  const tagLabels = post.data.tags
    .map((tag) => getTag(tag)?.labelByLocale[post.data.locale] ?? tag)
    .join(", ")
  const body = cleanMdxBody(post.body)

  return [
    "---",
    `title: ${quote(post.data.title)}`,
    `description: ${quote(post.data.description)}`,
    `canonical: ${quote(canonicalPostUrl(post))}`,
    `markdown: ${quote(markdownUrl(post))}`,
    `locale: ${quote(post.data.locale)}`,
    `category: ${quote(post.data.category)}`,
    `categoryLabel: ${quote(category?.labelByLocale[post.data.locale] ?? post.data.category)}`,
    `tags: [${post.data.tags.map(quote).join(", ")}]`,
    `tagLabels: ${quote(tagLabels)}`,
    `published: ${quote(isoDate(post.data.pubDate))}`,
    `updated: ${quote(isoDate(post.data.updatedDate ?? post.data.pubDate))}`,
    "---",
    "",
    `# ${post.data.title}`,
    "",
    post.data.description,
    "",
    body,
    "",
  ].join("\n")
}

export function renderLlmsTxt(posts: readonly PostEntry[]): string {
  const latestPosts = posts.slice(0, 12)
  const examplePost =
    [...posts]
      .filter((post) => post.data.locale === DEFAULT_LOCALE)
      .sort((a, b) => postSlug(a).localeCompare(postSlug(b)))[0] ??
    latestPosts[0]

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
    "## Markdown endpoints",
    "",
    "Article Markdown is available at `/:lang/posts/:slug.md`.",
    examplePost
      ? `Example: [${examplePost.data.title}](${markdownUrl(examplePost)})`
      : "",
    "",
    "## Recent posts",
    "",
    ...latestPosts.map(
      (post) =>
        `- [${post.data.title}](${canonicalPostUrl(post)}) ([Markdown](${markdownUrl(post)})) - ${post.data.description}`
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
      const category = getCategory(post.data.category)
      const tags = post.data.tags
        .map((tag) => getTag(tag)?.labelByLocale[locale] ?? tag)
        .join(", ")
      lines.push(
        `- [${post.data.title}](${canonicalPostUrl(post)})`,
        `  - Markdown: ${markdownUrl(post)}`,
        `  - Description: ${post.data.description}`,
        `  - Category: ${category?.labelByLocale[locale] ?? post.data.category}`,
        `  - Tags: ${tags || "None"}`,
        `  - Published: ${post.data.pubDate.toISOString().slice(0, 10)}`
      )
    }

    lines.push("")
  }

  return lines.join("\n")
}
