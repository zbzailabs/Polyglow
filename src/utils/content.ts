import { getCollection, type CollectionEntry } from "astro:content"

import type { Locale } from "@/config/locales"

export async function getPage(locale: Locale, slug: string): Promise<CollectionEntry<"page"> | undefined> {
  return (await getCollection("page", (entry) => !entry.data.draft)).find((page) => page.data.locale === locale && (page.data.slug ?? page.id.replace(/\.(md|mdx|markdown)$/i, "").replace(`${locale}/`, "")) === slug)
}

export async function getAuthor(locale: Locale, slug = "default"): Promise<CollectionEntry<"author"> | undefined> {
  return (await getCollection("author", (entry) => !entry.data.draft)).find((author) => author.data.locale === locale && author.data.slug === slug)
}
