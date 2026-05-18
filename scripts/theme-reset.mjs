import { cp, mkdir, readdir, rm } from "node:fs/promises"
import { join, relative } from "node:path"
import { pathToFileURL } from "node:url"

const contentMappings = [
  ["posts", "src/content/posts"],
  ["pages", "src/content/pages"],
  ["authors", "src/content/authors"],
]

async function walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(path)))
    else files.push(path)
  }
  return files
}

async function plannedTemplateFiles(templateDir) {
  const planned = []
  for (const [sourceDir, targetDir] of contentMappings) {
    const source = join(templateDir, sourceDir)
    const files = await walk(source)
    for (const file of files) {
      planned.push(join(targetDir, relative(source, file)))
    }
  }
  return planned.sort()
}

export async function resetThemeContent(options = {}) {
  const root = options.root ?? process.cwd()
  const templateDir =
    options.templateDir ?? join(root, "examples/minimal-content")
  const apply = Boolean(options.apply)
  const replace = Boolean(options.replace)
  const plannedFiles = await plannedTemplateFiles(templateDir)
  const writtenFiles = []

  if (!apply) {
    return {
      applied: false,
      plannedFiles,
      writtenFiles,
    }
  }

  for (const [sourceDir, targetDir] of contentMappings) {
    const source = join(templateDir, sourceDir)
    const target = join(root, targetDir)
    if (replace) await rm(target, { force: true, recursive: true })
    await mkdir(target, { recursive: true })
    await cp(source, target, { force: true, recursive: true })
  }

  writtenFiles.push(...plannedFiles)

  return {
    applied: true,
    plannedFiles,
    writtenFiles,
  }
}

function parseArgs(argv) {
  const args = {
    apply: false,
    replace: false,
    root: process.cwd(),
    templateDir: undefined,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "--apply") args.apply = true
    else if (arg === "--replace") args.replace = true
    else if (arg === "--root") {
      args.root = argv[index + 1]
      index += 1
    } else if (arg === "--template") {
      args.templateDir = argv[index + 1]
      index += 1
    }
  }

  return args
}

function printResult(result) {
  if (!result.applied) {
    console.log("Theme reset dry run. No files were changed.")
    console.log("Planned files:")
    for (const file of result.plannedFiles) console.log(`- ${file}`)
    console.log(
      "Run `pnpm theme:reset -- --apply` to copy the minimal content."
    )
    return
  }

  console.log("Theme minimal content copied.")
  for (const file of result.writtenFiles) console.log(`- ${file}`)
  console.log("Next: run `pnpm theme:check` and `pnpm build`.")
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const result = await resetThemeContent(args)
  printResult(result)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
