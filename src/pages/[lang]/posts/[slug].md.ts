import { getPublishedPosts, postSlug } from "@/utils/posts"
import { renderPostMarkdown } from "@/utils/agent-markdown"

export const trailingSlash = "never"

export async function getStaticPaths() {
  const posts = await getPublishedPosts()

  return posts.map((post) => ({
    params: {
      lang: post.data.locale,
      slug: postSlug(post),
    },
    props: { post },
  }))
}

export function GET({
  props,
}: {
  props: Awaited<ReturnType<typeof getStaticPaths>>[number]["props"]
}) {
  return new Response(renderPostMarkdown(props.post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
