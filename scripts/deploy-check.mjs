const invalidHostPatterns = [
  /(^|\.)example\./i,
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
]

function requireProductionUrl(name) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`${name} is required for deployment.`)
  }

  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`)
  }

  if (url.protocol !== "https:") {
    throw new Error(`${name} must use https.`)
  }

  if (invalidHostPatterns.some((pattern) => pattern.test(url.hostname))) {
    throw new Error(`${name} must not use a placeholder or local hostname.`)
  }

  return url
}

function validateOptionalHttpsUrl(name) {
  const value = process.env[name]?.trim()
  if (!value) return

  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be a valid absolute URL when set.`)
  }

  if (url.protocol !== "https:") {
    throw new Error(`${name} must use https when set.`)
  }

  if (invalidHostPatterns.some((pattern) => pattern.test(url.hostname))) {
    throw new Error(`${name} must not use a placeholder or local hostname.`)
  }
}

try {
  requireProductionUrl("PUBLIC_SITE_URL")
  validateOptionalHttpsUrl("PUBLIC_ASSET_BASE_URL")
  console.log("Deployment environment passed.")
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
