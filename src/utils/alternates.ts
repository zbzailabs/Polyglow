import { buildAlternates } from "@/utils/routes"
import type { PostEntry } from "@/utils/posts"
import { postPath } from "@/utils/posts"

type PostLike = Pick<PostEntry, "id" | "data" | "collection">

export function postLocaleAlternates(post: PostLike) {
  return buildAlternates(postPath(post))
}
