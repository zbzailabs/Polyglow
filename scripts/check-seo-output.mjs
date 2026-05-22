import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const distDir = join(process.cwd(), "dist")
const siteUrl = (process.env.PUBLIC_SITE_URL ?? "https://realrip.com").replace(
  /\/$/,
  ""
)
const localeHreflang = {
  zh: "zh-CN",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  ru: "ru-RU",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-PT",
  de: "de-DE",
  id: "id-ID",
  ar: "ar",
}
const locales = Object.keys(localeHreflang)
const expectedHreflangs = new Set([...Object.values(localeHreflang), "x-default"])
const failures = []

function fail(message) {
  failures.push(message)
}

function walkHtml(dir) {
  if (!existsSync(dir)) return []

  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return walkHtml(path)
    return entry === "index.html" ? [path] : []
  })
}

function extractAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`, "i"))
  return match?.[1]
}

function htmlPathToUrl(file) {
  const rel = relative(distDir, file).split(sep).join("/")
  const path = rel === "index.html" ? "/" : `/${rel.replace(/index\.html$/, "")}`
  return `${siteUrl}${path}`
}

function htmlPathToLocale(file) {
  const rel = relative(distDir, file).split(sep).join("/")
  const locale = rel.split("/")[0]
  return locales.includes(locale) ? locale : undefined
}

function validateHtml(file) {
  const rel = relative(process.cwd(), file)
  const html = readFileSync(file, "utf8")
  const expectedUrl = htmlPathToUrl(file)
  const locale = htmlPathToLocale(file)
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim()
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+>/i)?.[0]
  const description = html.match(/<meta[^>]+name="description"[^>]+>/i)?.[0]
  const robots = html.match(/<meta[^>]+name="robots"[^>]+>/i)?.[0]
  const contentLanguage = html.match(
    /<meta[^>]+http-equiv="content-language"[^>]+>/i
  )?.[0]
  const noindex = /content="[^"]*noindex/i.test(robots ?? "")
  const alternates = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+>/gi)]
    .map((match) => match[0])
    .map((tag) => ({
      hreflang: extractAttr(tag, "hreflang"),
      href: extractAttr(tag, "href"),
    }))
    .filter((alternate) => alternate.hreflang && alternate.href)

  if (!title) fail(`${rel}: missing <title>`)
  if (!canonical) fail(`${rel}: missing canonical link`)
  if (!robots) fail(`${rel}: missing robots meta`)

  if (!noindex && canonical && extractAttr(canonical, "href") !== expectedUrl) {
    fail(`${rel}: canonical does not match ${expectedUrl}`)
  }

  if (noindex) {
    if (alternates.length > 0) fail(`${rel}: noindex page has hreflang links`)
    return
  }

  if (!description) fail(`${rel}: missing meta description`)
  if (!html.includes('property="og:title"')) fail(`${rel}: missing og:title meta`)
  if (!html.includes('property="og:url"')) fail(`${rel}: missing og:url meta`)
  if (!html.includes('name="twitter:site"')) {
    fail(`${rel}: missing twitter:site meta`)
  }
  if (!html.includes('type="application/ld+json"')) {
    fail(`${rel}: missing JSON-LD structured data`)
  }

  if (!locale) return

  if (extractAttr(contentLanguage ?? "", "content") !== localeHreflang[locale]) {
    fail(`${rel}: content-language does not match locale`)
  }
  if (alternates.length !== expectedHreflangs.size) {
    fail(`${rel}: expected ${expectedHreflangs.size} hreflang links`)
  }

  const alternateMap = new Map(
    alternates.map((alternate) => [alternate.hreflang, alternate.href])
  )

  for (const hreflang of expectedHreflangs) {
    if (!alternateMap.has(hreflang)) fail(`${rel}: missing hreflang ${hreflang}`)
  }

  const selfHref = alternateMap.get(localeHreflang[locale])
  if (selfHref !== expectedUrl) {
    fail(`${rel}: hreflang self-reference does not match canonical`)
  }

  const defaultHref = alternateMap.get("x-default")
  if (defaultHref !== alternateMap.get(localeHreflang.zh)) {
    fail(`${rel}: x-default does not point to the default zh locale`)
  }
}

const htmlFiles = walkHtml(distDir)
if (htmlFiles.length === 0) {
  console.error("No built HTML files found. Run `pnpm build` before `pnpm seo:check`.")
  process.exit(1)
}

for (const file of htmlFiles) validateHtml(file)

if (failures.length === 0) {
  console.log(`SEO output check passed for ${htmlFiles.length} HTML pages.`)
  process.exit(0)
}

console.error(`SEO output check failed with ${failures.length} issue(s).`)
for (const failure of failures.slice(0, 100)) {
  console.error(failure)
}
if (failures.length > 100) {
  console.error(`...and ${failures.length - 100} more.`)
}
process.exit(1)
