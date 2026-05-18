type NavigablePost = {
  id: string
  data: {
    locale: string
    category: string
    tags: readonly string[]
    pubDate: Date
  }
}

export function selectAdjacentPosts<TPost extends NavigablePost>(posts: readonly TPost[], current: TPost) {
  const currentIndex = posts.findIndex((post) => post.id === current.id)

  return {
    newer: currentIndex > 0 ? posts[currentIndex - 1] : undefined,
    older: currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined,
  }
}

export function selectRelatedPosts<TPost extends NavigablePost>(posts: readonly TPost[], current: TPost, limit = 3): TPost[] {
  const currentTags = new Set(current.data.tags)

  return posts
    .filter((post) => post.id !== current.id && post.data.locale === current.data.locale)
    .map((post) => {
      const sharedTagCount = post.data.tags.filter((tag) => currentTags.has(tag)).length
      const categoryScore = post.data.category === current.data.category ? 10 : 0

      return {
        post,
        score: categoryScore + sharedTagCount,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime())
    .slice(0, limit)
    .map((item) => item.post)
}
