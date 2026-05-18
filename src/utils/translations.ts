import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/config/locales"

type Dict = Record<string, unknown>

const modules = import.meta.glob("../i18n/*.json", { eager: true })

function asDict(mod: unknown): Dict {
  if (mod && typeof mod === "object" && "default" in mod) return (mod as { default: Dict }).default
  return (mod as Dict) || {}
}

function extractLocale(path: string): Locale | undefined {
  const match = path.match(/\/i18n\/(\w+)\.json$/)
  const code = match?.[1]
  return LOCALES.includes(code as Locale) ? (code as Locale) : undefined
}

const DICTS = Object.fromEntries(LOCALES.map((locale) => [locale, {}])) as Record<Locale, Dict>

for (const [path, mod] of Object.entries(modules)) {
  const locale = extractLocale(path)
  if (locale) DICTS[locale] = asDict(mod)
}

function get(obj: Dict, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) return (acc as Dict)[part]
    return undefined
  }, obj)
}

function format(value: string, vars?: Record<string, string | number>): string {
  if (!vars) return value
  return value.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : `{${key}}`))
}

export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const value = get(DICTS[locale], key)
  if (typeof value === "string") return format(value, vars)
  const fallback = get(DICTS[DEFAULT_LOCALE], key)
  return typeof fallback === "string" ? format(fallback, vars) : key
}
