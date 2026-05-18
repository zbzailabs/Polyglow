import rss from "@astrojs/rss"

import { SITE_CONFIG } from "@/config/site"
import { getPostsForLocale, postUrl } from "@/utils/posts"

export async function GET() {
  const posts = await getPostsForLocale("en")

  return rss({
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    site: SITE_CONFIG.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  })
}
