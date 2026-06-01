import { createIndex } from "pagefind"
import sirv from "sirv"
import { readFile, readdir, rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import type { AstroIntegration } from "astro"
import { LOCALES, type Locale } from "../config/locales"

const SEARCHABLE_PAGE_PATTERN =
  /^(?:about|posts\/(?!\d+\/)[^/]+)\/index\.html$/

type PagefindOptions = {
  indexConfig?: Parameters<typeof createIndex>[0]
}

const toPosixPath = (value: string) => value.split(path.sep).join("/")

const getLocaleSearchableFiles = (
  htmlFiles: string[],
  outDir: string,
  locale: Locale
) =>
  htmlFiles.filter((file) => {
    const relativePath = toPosixPath(path.relative(outDir, file))
    const localePrefix = `${locale}/`
    if (!relativePath.startsWith(localePrefix)) return false

    return SEARCHABLE_PAGE_PATTERN.test(relativePath.slice(localePrefix.length))
  })

const collectHtmlFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath)
    }
  }

  return files
}

export default function pagefind({
  indexConfig,
}: PagefindOptions = {}): AstroIntegration {
  let clientDir: string | undefined

  return {
    name: "polyglow-pagefind",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        if (config.output === "server") {
          logger.warn(
            "Pagefind requires static HTML output and will not index server output."
          )
        }
        if (config.adapter) {
          clientDir = fileURLToPath(config.build.client)
        }
      },
      "astro:server:setup": ({ server, logger }) => {
        const root =
          typeof server.config.root === "string"
            ? server.config.root
            : fileURLToPath(server.config.root)
        const outDir = clientDir ?? path.join(root, server.config.build.outDir)
        logger.debug(`Serving pagefind from ${outDir}`)

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        })

        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/pagefind/")) {
            serve(req, res, next)
          } else {
            next()
          }
        })
      },
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir)
        await rm(path.join(outDir, "pagefind"), { force: true, recursive: true })
        const htmlFiles = await collectHtmlFiles(outDir)

        for (const locale of LOCALES) {
          const outputPath = path.join(outDir, "pagefind", locale)
          const { index, errors: createErrors } = await createIndex(indexConfig)
          if (!index) {
            logger.error(`Pagefind failed to create index for ${locale}`)
            createErrors.forEach((error) => logger.error(error))
            continue
          }

          const searchableFiles = getLocaleSearchableFiles(htmlFiles, outDir, locale)

          for (const file of searchableFiles) {
            const relativePath = toPosixPath(path.relative(outDir, file))
            const content = await readFile(file, "utf8")
            const { errors } = await index.addHTMLFile({
              url: `/${relativePath.replace(/index\.html$/, "")}`,
              content,
            })

            if (errors.length) {
              logger.error(
                `Pagefind failed to index ${path.relative(outDir, file)} for ${locale}`
              )
              errors.forEach((error) => logger.error(error))
            }
          }

          logger.info(
            `Pagefind indexed ${searchableFiles.length} pages for ${locale}`
          )

          const { outputPath: writtenPath, errors: writeErrors } =
            await index.writeFiles({ outputPath })
          if (writeErrors.length) {
            logger.error(`Pagefind failed to write index for ${locale}`)
            writeErrors.forEach((error) => logger.error(error))
            continue
          }

          logger.info(`Pagefind wrote ${locale} index to ${writtenPath}`)
        }
      },
    },
  }
}
