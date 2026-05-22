const CONTENT_EXTENSION_RE = /\.(md|mdx|markdown)$/i

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function stripContentExtension(value: string): string {
  return value.replace(CONTENT_EXTENSION_RE, "")
}

export function normalizeContentSlug(value: string, locale: string): string {
  const localePrefix = new RegExp(`^/?${escapeRegExp(locale)}/`)

  return stripContentExtension(value).replace(localePrefix, "")
}
