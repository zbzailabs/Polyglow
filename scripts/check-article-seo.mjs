import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const distDir = join(root, "dist")
const articleSourcePath = join(root, "src/pages/[lang]/posts/[...slug].astro")
const layoutSourcePath = join(root, "src/layouts/main.astro")
const samplePostPath = join(root, "src/content/posts/en/20150714-agiot.mdx")
const sampleArticlePath = join(distDir, "en/posts/20150714-agiot/index.html")
const siteOrigin = "https://polyglow.zbz.ai"
const minDescriptionBytes = 80
const failures = []
const indexableUrls = new Set()

function fail(message) {
  failures.push(message)
}

function walkHtmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walkHtmlFiles(path)
    return entry.name.endsWith(".html") ? [path] : []
  })
}

function walkFiles(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(path, extension)
    return entry.name.endsWith(extension) ? [path] : []
  })
}

function pagePath(filePath) {
  return `/${relative(distDir, dirname(filePath)).split(sep).join("/")}/`.replace(
    /\/index\/$/,
    "/"
  )
}

function attr(content, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(
    `<meta\\s+(?:name|property)=(["'])${escaped}\\1\\s+content=(["'])(.*?)\\2`,
    "i"
  )
  return content.match(pattern)?.[3] ?? null
}

function linkAttr(content, rel) {
  const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(
    `<link\\s+rel=(["'])${escaped}\\1\\s+href=(["'])(.*?)\\2`,
    "i"
  )
  return content.match(pattern)?.[3] ?? null
}

function title(content) {
  return content.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.trim() ?? null
}

function jsonLdItems(content) {
  const match = content.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i
  )
  if (!match) return []
  const parsed = JSON.parse(match[1])
  return Array.isArray(parsed) ? parsed : [parsed]
}

function frontmatterValue(content, key) {
  return content.match(new RegExp(`^${key}:\\s*["'](.+)["']\\s*$`, "m"))?.[1]
}

function assertAbsoluteUrl(value, label, filePath) {
  if (!value) {
    fail(`${label} missing in ${pagePath(filePath)}`)
    return null
  }
  const url = new URL(value)
  if (url.origin !== siteOrigin) {
    fail(`${label} must use ${siteOrigin} in ${pagePath(filePath)}`)
  }
  return url
}

function htmlPathForUrl(url) {
  return join(distDir, url.pathname, "index.html")
}

function isNoindexHtml(html) {
  return attr(html, "robots")?.includes("noindex") ?? false
}

function isOfficialIndexablePath(pathname) {
  if (pathname === "/") return false
  if (pathname.endsWith("/404/")) return false
  if (pathname.endsWith("/search/")) return false
  if (pathname.endsWith("/rss.xml/")) return false
  return true
}

function checkLayoutPage(filePath, html) {
  const path = pagePath(filePath)
  const pageTitle = title(html)
  if (!pageTitle) {
    fail(`Missing title in ${path}`)
    return
  }
  if (pageTitle.length > 80) fail(`Title is too long in ${path}: ${pageTitle.length}`)

  const description = attr(html, "description")
  if (!description) {
    fail(`Missing meta description in ${path}`)
    return
  }

  const robots = attr(html, "robots")
  const isNoindex = robots?.includes("noindex")
  if (!isNoindex && Buffer.byteLength(description, "utf8") < minDescriptionBytes) {
    fail(`Meta description is too short in ${path}: ${description}`)
  }

  const canonical = linkAttr(html, "canonical")
  if (!canonical) {
    fail(`Canonical URL missing in ${path}`)
    return
  }
  assertAbsoluteUrl(canonical, "Canonical URL", filePath)

  const ogUrl = attr(html, "og:url")
  if (ogUrl !== canonical) fail(`og:url must match canonical in ${path}`)
  for (const name of ["og:title", "og:description", "og:type", "og:image"]) {
    if (!attr(html, name)) fail(`Missing ${name} in ${path}`)
  }
  if (!attr(html, "og:image:alt")) fail(`Missing og:image:alt in ${path}`)

  for (const name of [
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
    "twitter:image:alt",
  ]) {
    if (!attr(html, name)) fail(`Missing ${name} in ${path}`)
  }

  const jsonLd = jsonLdItems(html)
  const webPage = jsonLd.find((item) => item["@type"] === "WebPage")
  if (!webPage) fail(`Missing WebPage JSON-LD in ${path}`)
  if (webPage.url !== canonical) fail(`WebPage JSON-LD url must match canonical in ${path}`)
  if (!webPage["@id"]?.endsWith("#webpage")) fail(`WebPage JSON-LD needs @id in ${path}`)

  if (isNoindex) return

  indexableUrls.add(canonical)

  const alternates = [
    ...html.matchAll(
      /<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["']/gi
    ),
  ]
  if (!alternates.length) fail(`Missing hreflang alternates in ${path}`)

  for (const [, hrefLang, href] of alternates) {
    if (hrefLang === "x-default") continue
    const url = assertAbsoluteUrl(href, `hreflang ${hrefLang}`, filePath)
    if (!url) continue

    const targetPath = htmlPathForUrl(url)
    if (!existsSync(targetPath)) {
      fail(`hreflang ${hrefLang} points to missing page in ${path}: ${url.pathname}`)
      continue
    }

    const targetHtml = readFileSync(targetPath, "utf8")
    if (isNoindexHtml(targetHtml)) {
      fail(`hreflang ${hrefLang} points to noindex page in ${path}: ${url.pathname}`)
    }
  }
}

function sitemapUrls() {
  const xmlFiles = walkFiles(distDir, ".xml").filter((filePath) =>
    filePath.includes("sitemap")
  )
  return new Set(
    xmlFiles.flatMap((filePath) => {
      const xml = readFileSync(filePath, "utf8")
      if (!xml.includes("<urlset")) return []
      return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
    })
  )
}

function checkSitemaps() {
  const urls = sitemapUrls()
  if (!urls.size) fail("Missing sitemap URLs")

  for (const urlValue of urls) {
    const url = assertAbsoluteUrl(urlValue, "Sitemap URL", sampleArticlePath)
    if (!url) continue

    const targetPath = htmlPathForUrl(url)
    if (!existsSync(targetPath)) {
      fail(`Sitemap URL points to missing HTML page: ${url.pathname}`)
      continue
    }

    const html = readFileSync(targetPath, "utf8")
    if (!isOfficialIndexablePath(url.pathname)) {
      fail(`Sitemap includes non-indexable route: ${url.pathname}`)
    }
    if (isNoindexHtml(html)) {
      fail(`Sitemap includes noindex page: ${url.pathname}`)
    }
  }

  for (const url of indexableUrls) {
    if (!urls.has(url)) fail(`Indexable page missing from sitemap: ${url}`)
  }
}

function checkArticlePage() {
  const html = readFileSync(sampleArticlePath, "utf8")
  const articleSource = readFileSync(articleSourcePath, "utf8")
  const layoutSource = readFileSync(layoutSourcePath, "utf8")
  const samplePost = readFileSync(samplePostPath, "utf8")
  const expectedAlt = frontmatterValue(samplePost, "heroImageAlt")

  if (!expectedAlt) fail("Sample post is missing heroImageAlt")

  const requiredMeta = [
    "article:published_time",
    "article:modified_time",
    "article:author",
    "article:section",
  ]

  for (const name of requiredMeta) {
    if (!attr(html, name)) fail(`Missing ${name} meta tag`)
  }

  const tagMatches = html.match(
    /<meta\s+property=["']article:tag["']\s+content=["'][^"']+["']/gi
  )
  if (!tagMatches?.length) fail("Missing article:tag meta tags")

  if (attr(html, "og:image:alt") !== expectedAlt) {
    fail("og:image:alt must use post heroImageAlt")
  }

  if (attr(html, "twitter:image:alt") !== expectedAlt) {
    fail("twitter:image:alt must use post heroImageAlt")
  }

  const article = jsonLdItems(html).find((item) => item["@type"] === "BlogPosting")
  if (!article) fail("Missing BlogPosting JSON-LD item")
  if (!article["@id"]?.endsWith("#article")) fail("BlogPosting JSON-LD needs stable @id")
  if (!article.articleSection) fail("BlogPosting JSON-LD missing articleSection")
  if (!Array.isArray(article.keywords) || article.keywords.length === 0) {
    fail("BlogPosting JSON-LD missing keywords")
  }
  if (!Number.isInteger(article.wordCount) || article.wordCount <= 0) {
    fail("BlogPosting JSON-LD missing positive wordCount")
  }
  if (article.thumbnailUrl !== attr(html, "og:image")) {
    fail("BlogPosting thumbnailUrl should match og:image")
  }

  if (!articleSource.includes("canonicalOverride={post.data.canonical}")) {
    fail("Article page must pass post frontmatter canonical to Layout")
  }

  if (!layoutSource.includes("canonicalOverride ?? canonicalUrl(lang, path)")) {
    fail("Layout must prefer canonicalOverride over the generated canonical URL")
  }
}

if (!existsSync(distDir)) {
  fail("Missing dist directory. Run `pnpm build` before this check.")
}
if (!existsSync(sampleArticlePath)) {
  fail("Missing built sample article. Run `pnpm build` before this check.")
}

const htmlFiles = walkHtmlFiles(distDir)
if (!htmlFiles.length) fail("No built HTML files found")

for (const filePath of htmlFiles) {
  const html = readFileSync(filePath, "utf8")
  if (html.includes("<meta http-equiv=\"refresh\"")) continue
  checkLayoutPage(filePath, html)
}
checkArticlePage()
checkSitemaps()

if (failures.length) {
  throw new Error(
    [`SEO checks failed with ${failures.length} issue(s):`, ...failures]
      .slice(0, 51)
      .join("\n- ")
  )
}

console.log(`SEO checks passed for ${htmlFiles.length} HTML files`)
