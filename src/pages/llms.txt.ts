import { getPublishedPosts } from "@/utils/posts"
import { renderLlmsTxt } from "@/utils/agent-markdown"

export async function GET() {
  const posts = await getPublishedPosts()

  return new Response(renderLlmsTxt(posts), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
