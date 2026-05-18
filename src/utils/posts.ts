import { getCollection, type CollectionEntry } from "astro:content"

import { LOCALES, type Locale } from "@/config/locales"

export type PostEntry = CollectionEntry<"post">

const publishedPostsPromise = getCollection("post", (entry) => !entry.data.draft)

export function sortPostsByDate(posts: readonly PostEntry[]): PostEntry[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
}

export function postSlug(entry: PostEntry): string {
  const withoutExt = entry.id.replace(/\.(md|mdx|markdown)$/i, "")
  return entry.data.slug ?? withoutExt.replace(new RegExp(`^${entry.data.locale}/`), "")
}

export function postPath(entry: PostEntry): string {
  return `/posts/${postSlug(entry)}/`
}

export function postUrl(entry: PostEntry): string {
  return `/${entry.data.locale}${postPath(entry)}`
}

export async function getPublishedPosts(): Promise<PostEntry[]> {
  return sortPostsByDate(await publishedPostsPromise)
}

export async function getPostsForLocale(locale: Locale): Promise<PostEntry[]> {
  return (await getPublishedPosts()).filter((post) => post.data.locale === locale)
}

export async function getPostsByCategory(locale: Locale, slug: string): Promise<PostEntry[]> {
  return (await getPostsForLocale(locale)).filter((post) => post.data.category === slug)
}

export async function getPostsByTag(locale: Locale, slug: string): Promise<PostEntry[]> {
  return (await getPostsForLocale(locale)).filter((post) => post.data.tags.includes(slug))
}

export function localeStaticPaths() {
  return LOCALES.map((locale) => ({ params: { lang: locale }, props: { lang: locale } }))
}
