import { SITE_CONFIG } from "@/config/site"

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE_CONFIG.url}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
