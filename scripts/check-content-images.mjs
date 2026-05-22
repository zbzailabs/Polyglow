import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const contentDir = join(process.cwd(), "src/content")
const contentExtensions = /\.(md|mdx|markdown)$/i
const picturePattern = /<OptimizedPicture\b[\s\S]*?\/>/g
const remoteSrcPattern = /\bsrc\s*=\s*["']https?:\/\/[^"']+["']/
const widthPattern = /\bwidth\s*=/
const heightPattern = /\bheight\s*=/

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(path)
      continue
    }
    if (contentExtensions.test(entry.name)) yield path
  }
}

function lineForIndex(source, index) {
  return source.slice(0, index).split("\n").length
}

const missingDimensions = []
let checked = 0

for (const file of walk(contentDir)) {
  const source = readFileSync(file, "utf8")
  for (const match of source.matchAll(picturePattern)) {
    const component = match[0]
    if (!remoteSrcPattern.test(component)) continue

    checked += 1
    if (widthPattern.test(component) && heightPattern.test(component)) continue

    missingDimensions.push({
      file,
      line: lineForIndex(source, match.index ?? 0),
      component: component.replace(/\s+/g, " ").trim(),
    })
  }
}

if (missingDimensions.length === 0) {
  console.log(`Checked ${checked} remote OptimizedPicture components. All include width and height.`)
  process.exit(0)
}

console.error(
  `Found ${missingDimensions.length} remote OptimizedPicture components without width/height out of ${checked} checked.`
)
for (const item of missingDimensions.slice(0, 50)) {
  console.error(`${item.file}:${item.line} ${item.component}`)
}
if (missingDimensions.length > 50) {
  console.error(`...and ${missingDimensions.length - 50} more.`)
}
process.exit(1)
