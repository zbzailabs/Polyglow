import { isPageViewsEnabled } from "./utils/page-view-counter"

export interface AnalyticsStatement {
  bind(...values: unknown[]): {
    first<T = unknown>(): Promise<T | null>
  }
}

export interface AnalyticsDatabase {
  prepare(query: string): AnalyticsStatement
}

export interface AnalyticsAssets {
  fetch(request: Request): Promise<Response>
}

export interface AnalyticsEnv {
  ANALYTICS_DB?: AnalyticsDatabase
  ASSETS: AnalyticsAssets
  PUBLIC_PAGE_VIEWS_ENABLED?: string
}

const PAGE_VIEW_SQL = `
  INSERT INTO page_views (path, views, updated_at)
  VALUES (?, 1, ?)
  ON CONFLICT(path) DO UPDATE SET
    views = page_views.views + 1,
    updated_at = excluded.updated_at
  RETURNING views
`

const STATIC_ASSET_EXTENSION = /\.[a-z0-9]{1,12}$/i

function json(data: unknown, init?: ResponseInit): Response {
  return Response.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      ...init?.headers,
    },
  })
}

export function normalizePageViewPath(input: unknown): string | null {
  if (typeof input !== "string") return null

  const value = input.trim()
  if (!value) return null

  let pathname: string
  try {
    pathname = new URL(value, "https://polyglow.local").pathname
  } catch {
    return null
  }

  if (!pathname.startsWith("/")) pathname = `/${pathname}`
  if (pathname.startsWith("/api/")) return null
  if (STATIC_ASSET_EXTENSION.test(pathname.split("/").at(-1) ?? "")) return null

  return pathname.endsWith("/") ? pathname : `${pathname}/`
}

export async function incrementPageView(
  db: AnalyticsDatabase,
  path: string
): Promise<number> {
  const row = await db
    .prepare(PAGE_VIEW_SQL)
    .bind(path, new Date().toISOString())
    .first<{ views: number }>()

  return typeof row?.views === "number" ? row.views : 0
}

export async function handlePageViewRequest(
  request: Request,
  env: AnalyticsEnv
): Promise<Response> {
  if (!isPageViewsEnabled(env.PUBLIC_PAGE_VIEWS_ENABLED)) {
    return json({ error: "Not found" }, { status: 404 })
  }

  if (!env.ANALYTICS_DB) {
    return json({ error: "Analytics database is not configured" }, { status: 503 })
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const path = normalizePageViewPath(
    body && typeof body === "object" && "path" in body
      ? (body as { path?: unknown }).path
      : undefined
  )

  if (!path) {
    return json({ error: "Invalid page path" }, { status: 400 })
  }

  const count = await incrementPageView(env.ANALYTICS_DB, path)

  return json({ path, count })
}

export default {
  async fetch(request: Request, env: AnalyticsEnv): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === "/api/page-view") {
      return handlePageViewRequest(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
