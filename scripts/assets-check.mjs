import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"

const allowedHosts = new Set(["images.unsplash.com"])

if (process.env.PUBLIC_ASSET_BASE_URL) {
  try {
    const url = new URL(process.env.PUBLIC_ASSET_BASE_URL)
    if (url.protocol !== "https:") {
      throw new Error("PUBLIC_ASSET_BASE_URL must use https.")
    }
    allowedHosts.add(url.hostname)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(path)))
    else if (/\.(md|mdx|markdown)$/.test(entry.name)) files.push(path)
  }
  return files
}

let failures = 0
for (const file of await walk("src/content")) {
  const text = await readFile(file, "utf8")
  for (const match of text.matchAll(/heroImage:\s+"(https:\/\/[^"]+)"/g)) {
    const host = new URL(match[1]).hostname
    if (
      ![...allowedHosts].some(
        (allowed) => host === allowed || host.endsWith(`.${allowed}`)
      )
    ) {
      console.error(`${file}: unsupported remote image host ${host}`)
      failures += 1
    }
  }
}

if (failures > 0) process.exit(1)
console.log("Asset references passed.")
