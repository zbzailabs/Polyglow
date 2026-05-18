import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/config/locales"
import { SITE_CONFIG } from "@/config/site"

export function withTrailingSlash(path: string): string {
  if (path === "") return "/"
  return path.endsWith("/") ? path : `${path}/`
}

export function normalizePath(path: string): string {
  const next = path.startsWith("/") ? path : `/${path}`
  return withTrailingSlash(next)
}

export function localePath(locale: Locale, path = "/"): string {
  const normalized = normalizePath(path)
  return withTrailingSlash(`/${locale}${normalized === "/" ? "" : normalized}`)
}

export function canonicalUrl(locale: Locale, path = "/"): string {
  return `${SITE_CONFIG.url}${localePath(locale, path)}`
}

export function buildAlternates(path = "/"): Record<Locale | "x-default", string> {
  const entries = Object.fromEntries(LOCALES.map((locale) => [locale, canonicalUrl(locale, path)])) as Record<Locale, string>
  return { ...entries, "x-default": canonicalUrl(DEFAULT_LOCALE, path) }
}
