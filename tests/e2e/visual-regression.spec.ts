import { expect, test } from "@playwright/test"

const surfaces = [
  { name: "home", path: "/en/" },
  { name: "article", path: "/en/posts/20150714-agiot/" },
  { name: "category", path: "/en/category/invest/" },
  { name: "search", path: "/en/search/" },
  { name: "author", path: "/en/author/" },
  { name: "not-found", path: "/en/not-a-real-page/" },
]

const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 844 },
]

test.describe("visual regression baseline", () => {
  for (const surface of surfaces) {
    for (const viewport of viewports) {
      test(`${surface.name} ${viewport.name}`, async ({ page }, testInfo) => {
        test.skip(
          testInfo.project.name !== "chromium",
          "Visual snapshots are captured once in the desktop Chromium project."
        )
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        })
        await page.goto(surface.path, { waitUntil: "networkidle" })
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
              scroll-behavior: auto !important;
            }
          `,
        })

        await expect(page).toHaveScreenshot(
          `${surface.name}-${viewport.name}.png`,
          {
            fullPage: true,
            mask: [page.locator("img"), page.locator("picture")],
            maxDiffPixelRatio: 0.02,
          }
        )
      })
    }
  }
})
