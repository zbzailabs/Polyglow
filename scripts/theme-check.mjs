import { readFile, readdir } from "node:fs/promises"
import { join, relative } from "node:path"
import { pathToFileURL } from "node:url"

const defaultRules = [
  {
    rule: "ADOPT001",
    file: "src/config/site.ts",
    pattern: /name:\s*["']Polyglow["']/,
    message: "Default site name is still configured.",
    fix: "Change SITE_CONFIG.name to your site name.",
  },
  {
    rule: "ADOPT002",
    file: "src/config/site.ts",
    pattern: /polyglow\.realrip\.com/,
    message: "Default production domain is still configured.",
    fix: "Set PUBLIC_SITE_URL or SITE_CONFIG.url to your production domain.",
  },
  {
    rule: "ADOPT003",
    file: "src/config/site.ts",
    pattern: /realriplab\/Polyglow-next/i,
    message: "Default repository link is still configured.",
    fix: "Change SITE_CONFIG.repository to your repository URL.",
  },
  {
    rule: "ADOPT004",
    file: "src/content/authors/en/default.md",
    pattern: /Polyglow Editorial/,
    message: "Default author profile is still configured.",
    fix: "Edit the default author name and biography.",
  },
  {
    rule: "ADOPT005",
    file: "src/content/posts",
    pattern: /This editorial note keeps|Category focus:|Editorial purpose:/,
    recursive: true,
    message: "Starter demo article copy is still present.",
    fix: "Replace demo posts or run theme:reset with an explicit apply flag.",
  },
  {
    rule: "ADOPT006",
    file: "README.md",
    pattern: /# Polyglow|polyglow\.realrip\.com|realriplab\/Polyglow-next/i,
    message: "Default README identity is still present.",
    fix: "Update README.md for your fork.",
  },
  {
    rule: "ADOPT007",
    file: "readme-zh.md",
    pattern: /# Polyglow|polyglow\.realrip\.com|realriplab\/Polyglow-next/i,
    message: "Default Chinese README identity is still present.",
    fix: "Update readme-zh.md for your fork.",
  },
  {
    rule: "ADOPT008",
    file: "src/content/pages/en/about.md",
    pattern: /Polyglow|multilingual Astro content site/i,
    message: "Default About page copy is still present.",
    fix: "Replace the About page with your site description.",
  },
  {
    rule: "ADOPT009",
    file: "src/content/authors/en/default.md",
    pattern: /realriplab\/Polyglow-next/i,
    message: "Default author links are still present.",
    fix: "Update author social links, RSS, and website URLs.",
  },
]

async function fileExists(path) {
  try {
    await readFile(path, "utf8")
    return true
  } catch {
    return false
  }
}

async function walkMarkdown(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walkMarkdown(path)))
    else if (/\.(md|mdx|markdown)$/i.test(entry.name)) files.push(path)
  }
  return files
}

async function readIfPresent(path) {
  if (!(await fileExists(path))) return ""
  return readFile(path, "utf8")
}

async function runRule(root, rule) {
  const basePath = join(root, rule.file)
  const files = rule.recursive ? await walkMarkdown(basePath) : [basePath]
  const issues = []

  for (const file of files) {
    const source = await readIfPresent(file)
    if (!source) continue
    if (rule.pattern.test(source)) {
      issues.push({
        rule: rule.rule,
        file: relative(root, file),
        message: rule.message,
        fix: rule.fix,
      })
    }
  }

  return issues
}

export async function checkTheme(options = {}) {
  const root = options.root ?? process.cwd()
  const issues = []

  for (const rule of defaultRules) {
    issues.push(...(await runRule(root, rule)))
  }

  return {
    ok: issues.length === 0,
    issues,
  }
}

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "--json") args.json = true
    else if (arg === "--root") {
      args.root = argv[index + 1]
      index += 1
    }
  }

  return args
}

function printHumanResult(result) {
  if (result.ok) {
    console.log("Theme adoption check passed.")
    return
  }

  console.error("Theme adoption check found default starter values:")
  for (const issue of result.issues) {
    console.error(
      `- ${issue.rule} ${issue.file}: ${issue.message} ${issue.fix}`
    )
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const result = await checkTheme({ root: args.root })

  if (args.json) console.log(JSON.stringify(result, null, 2))
  else printHumanResult(result)

  if (!result.ok) process.exit(1)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
