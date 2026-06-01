import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const pagefindIntegration = await readFile(
  new URL("../src/integrations/pagefind.ts", import.meta.url),
  "utf8"
)
const pagefindSearch = await readFile(
  new URL("../src/components/features/PagefindSearch.astro", import.meta.url),
  "utf8"
)

test("Pagefind integration builds one index per locale", () => {
  assert.match(
    pagefindIntegration,
    /import\s+\{\s*LOCALES,\s*type\s+Locale\s*\}\s+from\s+"\.\.\/config\/locales"/
  )
  assert.match(pagefindIntegration, /for\s*\(\s*const\s+locale\s+of\s+LOCALES\s*\)/)
  assert.match(
    pagefindIntegration,
    /path\.join\(\s*outDir,\s*"pagefind",\s*locale\s*\)/
  )
})

test("Pagefind search loads the current locale bundle", () => {
  assert.match(pagefindSearch, /const\s+bundlePath\s*=\s*`\/pagefind\/\$\{lang\}\/`/)
  assert.match(
    pagefindSearch,
    /href=\{\s*`\/pagefind\/\$\{lang\}\/pagefind-ui\.css`\s*\}/
  )
  assert.match(pagefindSearch, /await\s+import\(\s*`\$\{bundlePath\}pagefind-ui\.js`\s*\)/)
  assert.match(pagefindSearch, /bundlePath,\s*\n\s*showImages:\s*false/)
})
