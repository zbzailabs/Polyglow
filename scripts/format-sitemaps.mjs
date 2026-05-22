import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const distDir = new URL("../dist/", import.meta.url)

for (const filename of readdirSync(distDir)) {
  if (!/^sitemap.*\.xml$/.test(filename)) continue

  const filePath = join(distDir.pathname, filename)
  const xml = readFileSync(filePath, "utf8")
  const formatted = `${xml.replace(/></g, ">\n<").trim()}\n`

  if (formatted !== xml) writeFileSync(filePath, formatted)
}
