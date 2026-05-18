import { getPublishedPosts } from "@/utils/posts"
import { renderLlmsFullTxt } from "@/utils/agent-markdown"

export async function GET() {
  const posts = await getPublishedPosts()

  return new Response(renderLlmsFullTxt(posts), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
