import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

const editableFiles = [
  "src/config/site.ts",
  "src/content/authors/en/default.md",
  "src/content/pages/en/about.md",
]

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    apply: false,
    siteName: undefined,
    siteUrl: undefined,
    repository: undefined,
    authorName: undefined,
    authorBio: undefined,
    aboutDescription: undefined,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "--apply") args.apply = true
    else if (arg === "--root") {
      args.root = argv[index + 1]
      index += 1
    } else if (arg === "--site-name") {
      args.siteName = argv[index + 1]
      index += 1
    } else if (arg === "--site-url") {
      args.siteUrl = argv[index + 1]
      index += 1
    } else if (arg === "--repository") {
      args.repository = argv[index + 1]
      index += 1
    } else if (arg === "--author-name") {
      args.authorName = argv[index + 1]
      index += 1
    } else if (arg === "--author-bio") {
      args.authorBio = argv[index + 1]
      index += 1
    } else if (arg === "--about-description") {
      args.aboutDescription = argv[index + 1]
      index += 1
    }
  }

  return args
}

function replaceStringProperty(source, property, value) {
  if (!value) return source
  return source.replace(
    new RegExp(`(${property}:\\s*")[^"]*(")`),
    `$1${value}$2`
  )
}

function replaceQuotedFrontmatter(source, key, value) {
  if (!value) return source
  return source.replace(new RegExp(`(${key}:\\s*")[^"]*(")`), `$1${value}$2`)
}

async function readIfPresent(root, file) {
  try {
    return await readFile(join(root, file), "utf8")
  } catch {
    return undefined
  }
}

export async function initializeTheme(options = {}) {
  const root = options.root ?? process.cwd()
  const changes = []
  const next = new Map()

  const sitePath = "src/config/site.ts"
  const siteSource = await readIfPresent(root, sitePath)
  if (siteSource) {
    let source = siteSource
    source = replaceStringProperty(source, "name", options.siteName)
    source = replaceStringProperty(
      source,
      "description",
      options.aboutDescription
    )
    source = replaceStringProperty(source, "repository", options.repository)
    if (options.siteUrl) {
      source = source.replace(
        /https:\/\/polyglow\.realrip\.com/g,
        options.siteUrl.replace(/\/$/, "")
      )
    }
    if (source !== siteSource) {
      next.set(sitePath, source)
      changes.push(sitePath)
    }
  }

  const authorPath = "src/content/authors/en/default.md"
  const authorSource = await readIfPresent(root, authorPath)
  if (authorSource) {
    let source = authorSource
    source = replaceQuotedFrontmatter(source, "name", options.authorName)
    source = replaceQuotedFrontmatter(source, "bio", options.authorBio)
    if (options.repository) {
      source = source.replace(
        /https:\/\/github\.com\/realriplab\/Polyglow-next/g,
        options.repository
      )
    }
    if (source !== authorSource) {
      next.set(authorPath, source)
      changes.push(authorPath)
    }
  }

  const aboutPath = "src/content/pages/en/about.md"
  const aboutSource = await readIfPresent(root, aboutPath)
  if (aboutSource) {
    let source = aboutSource
    source = replaceQuotedFrontmatter(source, "title", options.siteName)
    source = replaceQuotedFrontmatter(
      source,
      "description",
      options.aboutDescription
    )
    if (source !== aboutSource) {
      next.set(aboutPath, source)
      changes.push(aboutPath)
    }
  }

  if (options.apply) {
    for (const [file, source] of next) {
      await writeFile(join(root, file), source)
    }
  }

  return {
    applied: Boolean(options.apply),
    changedFiles: changes,
    editableFiles,
  }
}

function printResult(result) {
  if (result.changedFiles.length === 0) {
    console.log("No theme initialization changes were prepared.")
    console.log("Editable files:")
    for (const file of result.editableFiles) console.log(`- ${file}`)
    return
  }

  console.log(
    result.applied
      ? "Theme initialization applied."
      : "Theme initialization dry run. No files were changed."
  )
  console.log("Changed files:")
  for (const file of result.changedFiles) console.log(`- ${file}`)
  if (!result.applied) {
    console.log("Run the same command with `--apply` to write these changes.")
  }
  console.log("Next: run `pnpm theme:check` and `pnpm build`.")
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const result = await initializeTheme(args)
  printResult(result)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
