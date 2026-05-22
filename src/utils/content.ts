import { getCollection, type CollectionEntry } from "astro:content"

import type { Locale } from "@/config/locales"
import { normalizeContentSlug } from "@/utils/content-slug"

export async function getPage(locale: Locale, slug: string): Promise<CollectionEntry<"page"> | undefined> {
  return (await getCollection("page", (entry) => !entry.data.draft)).find((page) => page.data.locale === locale && normalizeContentSlug(page.id, page.data.locale) === slug)
}

export async function getAuthor(locale: Locale, slug = "default"): Promise<CollectionEntry<"author"> | undefined> {
  return (await getCollection("author", (entry) => !entry.data.draft)).find((author) => author.data.locale === locale && author.data.slug === slug)
}
