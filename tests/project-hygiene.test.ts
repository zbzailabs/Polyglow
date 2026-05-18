import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, test } from "vitest"

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return walk(path)
    return path
  })

const readAll = (files: string[]) =>
  files.map((file) => readFileSync(file, "utf8")).join("\n")

describe("project hygiene", () => {
  test("keeps Spec Kit implementation artifacts complete and Chinese-first", () => {
    const activeFeature = JSON.parse(
      readFileSync(".specify/feature.json", "utf8")
    ) as { feature_directory?: string }
    const featureDirs = [
      "specs/001-theme-baseline",
      activeFeature.feature_directory,
    ].filter((value): value is string => Boolean(value))
    const requiredFiles = [
      "spec.md",
      "plan.md",
      "research.md",
      "data-model.md",
      "quickstart.md",
      "tasks.md",
    ]

    for (const featureDir of new Set(featureDirs)) {
      for (const file of requiredFiles) {
        const path = join(featureDir, file)
        expect(existsSync(path), `${path} should exist`).toBe(true)

        const source = readFileSync(path, "utf8")
        expect(source, `${path} should use Chinese section text`).toMatch(
          /[\u4e00-\u9fff]/
        )
        expect(
          source,
          `${path} should not keep template placeholders`
        ).not.toMatch(
          /\[[^\]]*(功能名称|feature-name|###-feature|标题)[^\]]*\]|NEEDS CLARIFICATION/
        )
      }
    }

    const agentGuide = readFileSync("AGENTS.md", "utf8")
    expect(agentGuide).toContain("specs/001-theme-baseline/plan.md")
    expect(agentGuide).toContain("specs/003-theme-adoption/plan.md")
  })

  test("keeps header controls Astro-native instead of React islands", () => {
    expect(existsSync("src/components/islands/LanguageSwitcher.astro")).toBe(
      true
    )
    expect(existsSync("src/components/islands/ThemeSwitcher.astro")).toBe(true)
    expect(existsSync("src/components/islands/MobileNav.astro")).toBe(true)
    expect(existsSync("src/components/islands/LanguageSwitcher.tsx")).toBe(
      false
    )
    expect(existsSync("src/components/islands/ThemeSwitcher.tsx")).toBe(false)
    expect(existsSync("src/components/islands/MobileNav.tsx")).toBe(false)
  })

  test("includes the release and open-source community files", () => {
    const requiredFiles = [
      "LICENSE",
      "CONTRIBUTING.md",
      "SECURITY.md",
      "CHANGELOG.md",
      ".github/pull_request_template.md",
      ".github/ISSUE_TEMPLATE/bug_report.yml",
      ".github/ISSUE_TEMPLATE/feature_request.yml",
      ".github/ISSUE_TEMPLATE/config.yml",
    ]

    for (const file of requiredFiles) {
      expect(existsSync(file), `${file} should exist`).toBe(true)
    }

    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      license?: string
    }
    expect(packageJson.license).toBe("MIT")

    const readme = readFileSync("README.md", "utf8")
    expect(readme).toContain("CONTRIBUTING.md")
    expect(readme).toContain("SECURITY.md")
    expect(readme).toContain("MIT")
  })

  test("documents writer-facing adoption paths without internal process links", () => {
    const requiredDocs = [
      "docs/release/preflight.md",
      "docs/content/authoring.md",
      "docs/content/demo-content.md",
      "docs/configuration/theme.md",
      "docs/integrations/analytics.md",
      "docs/integrations/cloudflare.md",
      "docs/integrations/static-hosting.md",
      "docs/adoption/fork-guide.md",
      "docs/adoption/minimal-content.md",
      "docs/adoption/preview.md",
    ]

    for (const file of requiredDocs) {
      expect(existsSync(file), `${file} should exist`).toBe(true)
    }

    const readme = readFileSync("README.md", "utf8")
    const chineseReadme = readFileSync("readme-zh.md", "utf8")
    const changelog = readFileSync("CHANGELOG.md", "utf8")
    const gitignore = readFileSync(".gitignore", "utf8")

    for (const file of requiredDocs) {
      expect(readme, `README.md should link ${file}`).toContain(file)
      expect(chineseReadme, `README-ZH.md should link ${file}`).toContain(file)
    }

    for (const source of [readme, chineseReadme]) {
      expect(source).not.toMatch(
        /docs\/architecture|docs\/quality|docs\/roadmap|docs\/release\/beta-release|Spec Kit|Playwright|Vitest|CI\b/
      )
    }

    expect(changelog).toContain("v1.0.0-beta.1")
    expect(changelog).not.toMatch(/shadcn|React islands/)
    expect(gitignore).toContain(".DS_Store")
  })

  test("keeps current contributor guidance aligned with Astro-native runtime", () => {
    const contributing = readFileSync("CONTRIBUTING.md", "utf8")

    expect(contributing).toContain("Node.js 24")
    expect(contributing).toContain("Astro components and small inline scripts")
    expect(contributing).not.toMatch(/React islands|shadcn/)

    expect(existsSync("PolyGlow-next.md")).toBe(false)
  })

  test("documents theme adoption scripts and minimal content without release internals", () => {
    const requiredDocs = [
      "docs/adoption/fork-guide.md",
      "docs/adoption/preview.md",
      "docs/adoption/minimal-content.md",
      "docs/integrations/static-hosting.md",
      "examples/minimal-content/README.md",
      "examples/minimal-content/posts/en/hello-world.mdx",
      "examples/minimal-content/pages/en/about.md",
      "examples/minimal-content/authors/en/default.md",
      "scripts/theme-check.mjs",
      "scripts/theme-init.mjs",
      "scripts/theme-reset.mjs",
    ]

    for (const file of requiredDocs) {
      expect(existsSync(file), `${file} should exist`).toBe(true)
    }

    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts?: Record<string, string>
    }
    expect(packageJson.scripts?.["theme:check"]).toBe(
      "node scripts/theme-check.mjs"
    )
    expect(packageJson.scripts?.["theme:init"]).toBe(
      "node scripts/theme-init.mjs"
    )
    expect(packageJson.scripts?.["theme:reset"]).toBe(
      "node scripts/theme-reset.mjs"
    )
    expect(packageJson.scripts?.["release:check"]).toBeUndefined()

    const readme = readFileSync("README.md", "utf8")
    const chineseReadme = readFileSync("readme-zh.md", "utf8")
    const changelog = readFileSync("CHANGELOG.md", "utf8")

    for (const file of requiredDocs.slice(0, 4)) {
      expect(readme, `README.md should link ${file}`).toContain(file)
      expect(chineseReadme, `readme-zh.md should link ${file}`).toContain(file)
    }

    expect(changelog).toContain("v1.0.0-beta.1")
    expect(existsSync("scripts/release-check.mjs")).toBe(false)
    expect(existsSync("docs/release/beta-release.md")).toBe(false)
    expect(existsSync("docs/architecture/components.md")).toBe(false)
    expect(existsSync("docs/architecture/spec-kit-workflow.md")).toBe(false)
    expect(existsSync("docs/quality/release-readiness-2026-05-14.md")).toBe(
      false
    )
    expect(existsSync("docs/roadmap.md")).toBe(false)
  })

  test("documents and exposes static AI-readable content surfaces", () => {
    const requiredFiles = [
      "src/pages/llms.txt.ts",
      "src/pages/llms-full.txt.ts",
      "src/pages/[lang]/posts/[slug].md.ts",
      "src/utils/agent-markdown.ts",
    ]

    for (const file of requiredFiles) {
      expect(existsSync(file), `${file} should exist`).toBe(true)
    }

    const readme = readFileSync("README.md", "utf8")
    const chineseReadme = readFileSync("readme-zh.md", "utf8")
    const cloudflareDocs = readFileSync(
      "docs/integrations/cloudflare.md",
      "utf8"
    )

    for (const source of [readme, chineseReadme]) {
      expect(source).toContain("/llms.txt")
      expect(source).toContain("/llms-full.txt")
      expect(source).toContain("/:lang/posts/:slug.md")
    }
    expect(cloudflareDocs).toContain("/llms.txt")
    expect(cloudflareDocs).toContain("/llms-full.txt")
    expect(cloudflareDocs).toContain("/:lang/posts/:slug.md")
    expect(cloudflareDocs).toContain("Markdown for Agents")
  })

  test("keeps CI lightweight for an open-source blog theme", () => {
    const ci = readFileSync(".github/workflows/ci.yml", "utf8")

    expect(ci).toContain("workflow_dispatch:")
    expect(ci).toContain("permissions:")
    expect(ci).toContain("contents: read")
    expect(ci).toContain("pnpm lint")
    expect(ci).toContain("pnpm test")
    expect(ci).toContain("pnpm typecheck")
    expect(ci).toContain("pnpm build")

    expect(ci).not.toContain("playwright install")
    expect(ci).not.toContain("pnpm test:e2e")
    expect(ci).not.toContain("actions/upload-artifact")
    expect(ci).not.toContain("pnpm assets:check")
  })

  test("deploys to Cloudflare only after main verification succeeds", () => {
    const ci = readFileSync(".github/workflows/ci.yml", "utf8")

    expect(ci).toContain("deploy:")
    expect(ci).toContain("needs: verify")
    expect(ci).toContain(
      "if: github.event_name == 'push' && github.ref == 'refs/heads/main'"
    )
    expect(ci).toContain("CLOUDFLARE_API_TOKEN:")
    expect(ci).toContain("secrets.CLOUDFLARE_API_TOKEN")
    expect(ci).toContain("PUBLIC_SITE_URL: https://polyglow.realrip.com")
    expect(ci).toContain("pnpm deploy")
  })

  test("keeps CI setup logs quiet on GitHub runners", () => {
    const ci = readFileSync(".github/workflows/ci.yml", "utf8")

    expect(ci).toContain("git config --global init.defaultBranch main")
    expect(ci).toContain("corepack enable")
    expect(ci).toContain("corepack prepare pnpm@11.0.9 --activate")
    expect(ci).toContain("node-version-file: .node-version")
    expect(ci).toContain("package-manager-cache: false")
    expect(ci).toContain("NODE_OPTIONS: --no-deprecation")

    expect(ci).not.toContain("pnpm/action-setup")
    expect(ci).not.toContain("cache: pnpm")
  })

  test("requires explicit production URLs before deploy", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts?: Record<string, string>
    }
    const deployScript = packageJson.scripts?.deploy ?? ""

    expect(packageJson.scripts?.["deploy:check"]).toBe(
      "node scripts/deploy-check.mjs"
    )
    expect(deployScript).toContain("pnpm run deploy:check")

    const envExample = readFileSync(".env.example", "utf8")
    const readme = readFileSync("README.md", "utf8")

    expect(envExample).toContain("PUBLIC_SITE_URL=https://polyglow.realrip.com")
    expect(envExample).not.toContain("polyglow-next.example.com")
    expect(readme).not.toContain("polyglow-next.example.com")

    const englishAuthor = readFileSync(
      "src/content/authors/en/default.md",
      "utf8"
    )
    const chineseAuthor = readFileSync(
      "src/content/authors/zh/default.md",
      "utf8"
    )
    expect(englishAuthor).not.toContain("polyglow-next.example.com")
    expect(chineseAuthor).not.toContain("polyglow-next.example.com")
  })

  test("locks architecture rules that avoid legacy Polyglow issues", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      dependencies?: Record<string, string>
    }
    expect(packageJson.dependencies?.["@astrojs/partytown"]).toBeDefined()

    const activeFiles = [
      ...walk("src"),
      ...walk("docs"),
      "README.md",
      "astro.config.mjs",
      "package.json",
    ]
    const text = readAll(activeFiles)

    const allowedSocialXUrl = "https://x.com/idimilabs"
    const textWithoutAllowedSocial = text.replaceAll(allowedSocialXUrl, "")
    expect(textWithoutAllowedSocial).not.toMatch(
      /idimilabs|chat\.idimi|inote\.xyz|iNote/i
    )
    expect(text).toContain(allowedSocialXUrl)
    expect(text).not.toMatch(
      /api\.github\.com|github-contributions-api|GITHUB_TOKEN/i
    )
    expect(text).not.toMatch(/langProp\s*=\s*["']zh["']/)

    const header = readFileSync("src/components/ui/Header.astro", "utf8")
    expect(header).toContain('href={localePath(lang, "/search/")}')
    expect(header).not.toContain("sticky top-0")
    expect(header).not.toContain("fixed top-0")
    expect(header).not.toContain("https://chat.idimi.com")
  })

  test("keeps the theme Astro-first with no React or shadcn runtime surface", () => {
    expect(existsSync("components.json")).toBe(false)

    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }
    const removedPackages = [
      "@astrojs/react",
      "@base-ui/react",
      "@types/react",
      "@types/react-dom",
      "react",
      "react-dom",
      "lucide-react",
      "next-themes",
      "sonner",
      "cmdk",
      "class-variance-authority",
      "tailwind-merge",
      "eslint-plugin-react-hooks",
      "eslint-plugin-react-refresh",
      "shadcn",
      "clsx",
    ]

    for (const dependency of removedPackages) {
      expect(
        allDependencies[dependency],
        `${dependency} should be removed`
      ).toBeUndefined()
    }

    const sourceFiles = walk("src")
    expect(sourceFiles.some((file) => file.endsWith(".tsx"))).toBe(false)

    const sourceText = readAll(sourceFiles)
    expect(sourceText).not.toMatch(
      /@astrojs\/react|@base-ui\/react|lucide-react|from "react"|client:/
    )

    const astroConfig = readFileSync("astro.config.mjs", "utf8")
    expect(astroConfig).not.toContain("@astrojs/react")
    expect(astroConfig).not.toContain("react()")

    const tsconfig = readFileSync("tsconfig.json", "utf8")
    expect(tsconfig).not.toContain("jsx")
    expect(tsconfig).not.toContain("react")
  })

  test("uses Astro-native SEO and transitions without global viewport prefetch", () => {
    const astroConfig = readFileSync("astro.config.mjs", "utf8")
    const layout = readFileSync("src/layouts/main.astro", "utf8")

    expect(astroConfig).not.toContain('defaultStrategy: "viewport"')
    expect(astroConfig).not.toContain("prefetch:")

    expect(layout).toContain('import { SEO } from "astro-seo"')
    expect(layout).toContain('import { ClientRouter } from "astro:transitions"')
    expect(layout).toContain("<ClientRouter")
    expect(layout).toContain("<SEO")
    expect(layout).not.toContain("<title>{pageTitle}</title>")
    expect(layout).not.toContain('<link rel="canonical" href={canonical}')

    expect(existsSync("src/utils/seo.ts")).toBe(false)
    expect(existsSync("src/utils/structured-data.ts")).toBe(true)
  })

  test("keeps the root fallback static and branded", () => {
    const rootPage = readFileSync("src/pages/index.astro", "utf8")

    expect(rootPage).toContain('href="https://polyglow.realrip.com/en/"')
    expect(rootPage).toContain("Continue to Polyglow")
    expect(rootPage).not.toContain("Polyglow-next")
  })

  test("keeps Astro content schemas on non-deprecated zod imports", () => {
    const contentConfig = readFileSync("src/content.config.ts", "utf8")

    expect(contentConfig).toContain(
      'import { defineCollection } from "astro:content"'
    )
    expect(contentConfig).toContain('import { z } from "astro/zod"')
    expect(contentConfig).toContain("z.url()")
    expect(contentConfig).not.toContain(
      'import { defineCollection, z } from "astro:content"'
    )
    expect(contentConfig).not.toContain('from "astro:schema"')
    expect(contentConfig).not.toContain("z.string().url()")
  })

  test("pins the Cloudflare build Node runtime", () => {
    const nodeVersion = readFileSync(".node-version", "utf8").trim()
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      engines?: Record<string, string>
    }

    expect(nodeVersion).toBe("24")
    expect(packageJson.engines?.node).toBe(">=24 <27")
  })

  test("uses Lucide through the Astro icon library", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      dependencies?: Record<string, string>
    }
    expect(packageJson.dependencies?.["astro-icon"]).toBeDefined()
    expect(packageJson.dependencies?.["@iconify-json/lucide"]).toBeDefined()

    const iconComponent = readFileSync(
      "src/components/icons/Icon.astro",
      "utf8"
    )
    expect(iconComponent).toContain("astro-icon/components")
    expect(iconComponent).toContain("lucide:")
    expect(iconComponent).not.toContain("const icons:")
    expect(iconComponent).not.toContain("set:html={icons")

    const astroConfig = readFileSync("astro.config.mjs", "utf8")
    expect(astroConfig).toContain('"github"')
  })

  test("prepares analytics through Partytown without loading it by default", () => {
    const astroConfig = readFileSync("astro.config.mjs", "utf8")
    const analytics = readFileSync(
      "src/components/features/Analytics.astro",
      "utf8"
    )

    expect(astroConfig).toContain("@astrojs/partytown")
    expect(astroConfig).toContain('forward: ["dataLayer.push"]')
    expect(analytics).toContain("PUBLIC_GOOGLE_ANALYTICS_ID")
    expect(analytics).toContain('type="text/partytown"')
    expect(analytics).toContain("googletagmanager.com/gtag/js")
  })

  test("uses the configured post counts per paginated listing page", () => {
    const paginationConfig = readFileSync("src/config/pagination.ts", "utf8")
    expect(paginationConfig).toContain("POSTS_PER_PAGE = 20")
    expect(paginationConfig).toContain("TAXONOMY_POSTS_PER_PAGE = 12")

    const postRoutes = [
      "src/pages/[lang]/[page].astro",
      "src/pages/[lang]/posts/[page].astro",
    ]
    const taxonomyRoutes = [
      "src/pages/[lang]/category/[slug]/[page].astro",
      "src/pages/[lang]/tags/[slug]/[page].astro",
    ]

    for (const route of postRoutes) {
      const source = readFileSync(route, "utf8")
      expect(
        source,
        `${route} should use the shared posts pagination size`
      ).toContain("pageSize: POSTS_PER_PAGE")
    }

    for (const route of taxonomyRoutes) {
      const source = readFileSync(route, "utf8")
      expect(
        source,
        `${route} should use the shared taxonomy pagination size`
      ).toContain("pageSize: TAXONOMY_POSTS_PER_PAGE")
    }

    const home = readFileSync("src/pages/[lang]/index.astro", "utf8")
    expect(home).toContain("posts.length > POSTS_PER_PAGE")
    expect(home).toContain("rest.slice(2, POSTS_PER_PAGE - 1)")

    const postsIndex = readFileSync(
      "src/pages/[lang]/posts/index.astro",
      "utf8"
    )
    expect(postsIndex).toContain("posts.slice(0, POSTS_PER_PAGE)")
    expect(postsIndex).toContain("`/${lang}/posts/2/`")

    const categoryIndex = readFileSync(
      "src/pages/[lang]/category/[slug]/index.astro",
      "utf8"
    )
    const tagIndex = readFileSync(
      "src/pages/[lang]/tags/[slug]/index.astro",
      "utf8"
    )
    expect(categoryIndex).toContain("posts.slice(0, TAXONOMY_POSTS_PER_PAGE)")
    expect(categoryIndex).toContain("`/${lang}/category/${slug}/2/`")
    expect(tagIndex).toContain("posts.slice(0, TAXONOMY_POSTS_PER_PAGE)")
    expect(tagIndex).toContain("`/${lang}/tags/${slug}/2/`")
  })

  test("optimizes source images through Astro image components", () => {
    const sourceFiles = walk("src").filter((file) => file.endsWith(".astro"))
    const sourceText = readAll(sourceFiles)
    const optimizedPicture = readFileSync(
      "src/components/features/OptimizedPicture.astro",
      "utf8"
    )

    expect(sourceText).not.toContain("<img")
    expect(optimizedPicture).toContain('import { Picture } from "astro:assets"')
    expect(optimizedPicture).toContain('formats={["avif", "webp"]}')
    expect(optimizedPicture).toContain('fallbackFormat="webp"')
    expect(optimizedPicture).not.toContain("needsPlainImg")
    expect(optimizedPicture).not.toContain("srcset={")
  })

  test("uses device fonts and locale-aware prose alignment", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      dependencies?: Record<string, string>
    }
    expect(
      packageJson.dependencies?.["@fontsource-variable/geist"]
    ).toBeUndefined()

    const styles = readFileSync("src/styles/global.css", "utf8")
    expect(styles).not.toContain("@fontsource-variable/geist")
    expect(styles).not.toContain("Geist Variable")
    expect(styles).toMatch(/--font-sans:\s*system-ui/)
    expect(styles).toContain(
      ':where(html[lang="zh"], html[lang="ja"], html[lang="ko"])'
    )
    expect(styles).toContain("@supports (text-autospace: normal)")
    expect(styles).toContain("text-autospace: normal")
    expect(styles).toContain("text-align: justify")
    expect(styles).toContain('html[dir="rtl"]')
  })

  test("keeps repeated listing page structure in reusable Astro components", () => {
    const requiredComponents = [
      "src/components/layout/PageSection.astro",
      "src/components/layout/ProseContent.astro",
      "src/components/navigation/TaxonomyPillNav.astro",
      "src/components/navigation/TaxonomyLinkGrid.astro",
      "src/components/ui/EmptyState.astro",
      "src/components/lists/PostTextCardGrid.astro",
    ]

    for (const file of requiredComponents) {
      expect(existsSync(file), `${file} should exist`).toBe(true)
    }

    const pageFiles = walk("src/pages").filter((file) =>
      file.endsWith(".astro")
    )
    const pageText = readAll(pageFiles)

    expect(pageText).not.toContain(
      "mx-auto w-full max-w-6xl px-4 py-6 sm:px-5 md:px-6"
    )
    expect(pageText).not.toContain(
      "glass-card mx-auto max-w-xl p-6 text-center text-sm text-white/80"
    )

    const categoryList = readFileSync(
      "src/pages/[lang]/category/index.astro",
      "utf8"
    )
    const tagList = readFileSync("src/pages/[lang]/tags/index.astro", "utf8")
    const categoryIndex = readFileSync(
      "src/pages/[lang]/category/[slug]/index.astro",
      "utf8"
    )
    const tagIndex = readFileSync(
      "src/pages/[lang]/tags/[slug]/index.astro",
      "utf8"
    )
    const categoryPage = readFileSync(
      "src/pages/[lang]/category/[slug]/[page].astro",
      "utf8"
    )
    const tagPage = readFileSync(
      "src/pages/[lang]/tags/[slug]/[page].astro",
      "utf8"
    )
    const aboutPage = readFileSync("src/pages/[lang]/about.astro", "utf8")
    const articlePage = readFileSync(
      "src/pages/[lang]/posts/[...slug].astro",
      "utf8"
    )

    expect(categoryList).toContain("TaxonomyLinkGrid")
    expect(categoryList).not.toContain("taxonomy-link-grid")
    expect(tagList).toContain("TaxonomyLinkGrid")
    expect(tagList).not.toContain("taxonomy-link-grid")
    expect(categoryIndex).toContain("EmptyState")
    expect(tagIndex).toContain("EmptyState")
    expect(categoryPage).toContain("TaxonomyPillNav")
    expect(tagPage).toContain("TaxonomyPillNav")
    expect(aboutPage).toContain("ProseContent")
    expect(aboutPage).toContain('columns="three"')
    expect(articlePage).toContain("ProseContent")
    expect(articlePage).toContain("PostCardGrid")
    expect(articlePage).not.toContain("sm:grid-cols-3")
  })

  test("keeps localized page labels in dictionaries instead of route files", () => {
    const routeExpectations = [
      ["src/pages/[lang]/about.astro", "pages.about.title", "About"],
      [
        "src/pages/[lang]/author.astro",
        "pages.author.title",
        "Writing Activity",
      ],
      ["src/pages/[lang]/posts/index.astro", "pages.posts.title", "All Posts"],
      [
        "src/pages/[lang]/posts/[page].astro",
        "pages.posts.archiveTitle",
        "Article Archive",
      ],
      [
        "src/pages/[lang]/category/index.astro",
        "pages.categories.h2",
        "Browse Categories",
      ],
      ["src/pages/[lang]/tags/index.astro", "pages.tags.h2", "Browse Tags"],
    ]

    for (const [file, key, literal] of routeExpectations) {
      const source = readFileSync(file, "utf8")
      expect(source, `${file} should use ${key}`).toContain(key)
      expect(source, `${file} should not hardcode ${literal}`).not.toContain(
        literal
      )
    }

    const footer = readFileSync("src/components/ui/Footer.astro", "utf8")
    expect(footer).toContain("footer.more")
    expect(footer).toContain("footer.categories")
    expect(footer).toContain("footer.tags")
    expect(footer).toContain("footer.author")
    expect(footer).not.toContain(">Categories<")
    expect(footer).not.toContain(">Tags<")
    expect(footer).not.toContain(">Author<")

    const english = readFileSync("src/i18n/en.json", "utf8")
    const chinese = readFileSync("src/i18n/zh.json", "utf8")
    expect(english).toContain('"All Posts"')
    expect(chinese).toContain('"所有文章"')
  })

  test("documents and exposes homepage layout variants", () => {
    const siteConfig = readFileSync("src/config/site.ts", "utf8")
    const home = readFileSync("src/pages/[lang]/index.astro", "utf8")
    const themeDocs = readFileSync("docs/configuration/theme.md", "utf8")
    const previewDocs = readFileSync("docs/adoption/preview.md", "utf8")

    expect(siteConfig).toContain('type HomepageLayout = "cover"')
    expect(siteConfig).toContain('layout: "cover"')
    expect(home).toContain('homepageLayout === "archive"')
    expect(home).toContain('homepageLayout === "text"')
    expect(home).toContain("PostArchiveList")
    expect(home).toContain("PostTextCardGrid")
    expect(themeDocs).toContain("cover")
    expect(themeDocs).toContain("archive")
    expect(themeDocs).toContain("text")
    expect(previewDocs).toContain("cover")
    expect(previewDocs).toContain("archive")
    expect(previewDocs).toContain("text")
  })

  test("keeps the visual palette on Tailwind neutral colors", () => {
    const styles = readFileSync("src/styles/global.css", "utf8")

    expect(styles).toContain("prose-neutral")
    expect(styles).toContain("neutral-")
    expect(styles).not.toMatch(
      /from-(indigo|violet|emerald|teal|pink|rose)-|to-(indigo|violet|emerald|teal|pink|rose)-|bg-(gray|indigo|violet|emerald|teal|pink|rose)-/
    )
    expect(styles).not.toContain("rgba(105, 103, 164")
  })
})
