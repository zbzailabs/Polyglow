import { spawn } from "node:child_process"
import { rmSync } from "node:fs"
import { join } from "node:path"

const attempts = Number.parseInt(process.env.WRANGLER_DEPLOY_ATTEMPTS ?? "3", 10)
const retryDelayMs = Number.parseInt(
  process.env.WRANGLER_DEPLOY_RETRY_DELAY_MS ?? "15000",
  10,
)
const maxAttempts = Number.isFinite(attempts) && attempts > 0 ? attempts : 3
const command = process.platform === "win32" ? "wrangler.cmd" : "wrangler"
const distDir = join(process.cwd(), "dist")

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function runWranglerDeploy() {
  return new Promise((resolve) => {
    let settled = false
    const child = spawn(command, ["deploy"], {
      env: {
        ...process.env,
        WRANGLER_SEND_METRICS: process.env.WRANGLER_SEND_METRICS ?? "false",
      },
      stdio: "inherit",
    })

    child.on("error", (error) => {
      if (settled) return
      settled = true
      console.error(error)
      resolve(1)
    })

    child.on("close", (code) => {
      if (settled) return
      settled = true
      resolve(code ?? 1)
    })
  })
}

rmSync(join(distDir, ".DS_Store"), { force: true })

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  if (maxAttempts > 1) {
    console.log(`Wrangler deploy attempt ${attempt}/${maxAttempts}`)
  }

  const code = await runWranglerDeploy()
  if (code === 0) {
    process.exit(0)
  }

  if (attempt === maxAttempts) {
    process.exit(code)
  }

  const delay = retryDelayMs * attempt
  console.warn(`Wrangler deploy failed with exit code ${code}; retrying in ${delay}ms`)
  await wait(delay)
}
