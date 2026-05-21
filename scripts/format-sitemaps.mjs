import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { resolve } from "node:path"

const distDir = resolve(process.cwd(), "dist")

function formatXml(xml) {
  const tokens = xml
    .replace(/>\s*</g, "><")
    .replace(/(<\?xml[^>]*\?>)/g, "$1\n")
    .replace(/(>)(<)(\/*)/g, "$1\n$2$3")
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  let depth = 0
  const lines = []

  for (const token of tokens) {
    const isDeclaration = token.startsWith("<?")
    const isClosingTag = token.startsWith("</")
    const isSelfClosing = token.endsWith("/>")
    const hasInlineClosingTag = /^<[^!?/][^>]*>.*<\/[^>]+>$/.test(token)

    if (isClosingTag) {
      depth = Math.max(depth - 1, 0)
    }

    lines.push(`${"  ".repeat(depth)}${token}`)

    if (
      !isDeclaration &&
      !isClosingTag &&
      !isSelfClosing &&
      !hasInlineClosingTag
    ) {
      depth += 1
    }
  }

  return `${lines.join("\n")}\n`
}

if (!existsSync(distDir)) {
  throw new Error("dist directory does not exist. Run astro build first.")
}

const sitemapFiles = readdirSync(distDir)
  .filter((file) => /^sitemap(?:-\d+|-index)?\.xml$/.test(file))
  .map((file) => resolve(distDir, file))

for (const file of sitemapFiles) {
  const xml = readFileSync(file, "utf8")
  writeFileSync(file, formatXml(xml))
}

const sitemapIndex = resolve(distDir, "sitemap-index.xml")
const sitemapAlias = resolve(distDir, "sitemap.xml")
if (existsSync(sitemapIndex)) {
  copyFileSync(sitemapIndex, sitemapAlias)
}
