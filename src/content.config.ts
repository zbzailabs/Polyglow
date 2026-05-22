import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

import { LOCALES } from "@/config/locales"

const locale = z.enum(LOCALES)

const generateId = ({ entry }: { entry: string }) =>
  entry.replace(/\.(md|mdx|markdown)$/i, "")

const remoteImageDimensions = (
  data: {
    heroImage?: string
    heroImageWidth?: number
    heroImageHeight?: number
  },
  ctx: {
    addIssue: (issue: {
      code: "custom"
      message: string
      path: string[]
    }) => void
  }
) => {
  if (!data.heroImage?.startsWith("https://")) return
  if (!data.heroImageWidth || !data.heroImageHeight) {
    ctx.addIssue({
      code: "custom",
      message: "Remote heroImage requires heroImageWidth and heroImageHeight.",
      path: ["heroImage"],
    })
  }
}

const post = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx,markdown}",
    base: "./src/content/posts",
    generateId,
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      authors: z.array(z.string()).min(1).default(["default"]),
      heroImage: z.string(),
      heroImageAlt: z.string(),
      heroImageWidth: z.number().int().positive().optional(),
      heroImageHeight: z.number().int().positive().optional(),
      heroBlurDataURL: z.string().optional(),
      canonical: z.url().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      locale,
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    })
    .superRefine(remoteImageDimensions),
})

const page = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx,markdown}",
    base: "./src/content/pages",
    generateId,
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale,
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    noindex: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
})

const author = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx,markdown}",
    base: "./src/content/authors",
    generateId,
  }),
  schema: z.object({
    name: z.string(),
    bio: z.string().default(""),
    locale,
    slug: z.string().default("default"),
    avatar: z.string().optional(),
    avatarWidth: z.number().int().positive().optional(),
    avatarHeight: z.number().int().positive().optional(),
    githubUsername: z.string().optional(),
    socials: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().refine((value) => {
            if (value.startsWith("/")) return true
            return z.url().safeParse(value).success
          }, "Social URL must be absolute or root-relative."),
        })
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { post, page, author }
