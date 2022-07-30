import path from 'path'
import { sync } from 'glob'
import { bundleMDX } from 'mdx-bundler'

import type { MdxListItem, MdxPage } from '~/types'

const blogPostsPath = path.join(process.cwd(), 'content/blog')

export async function getBlogMdxPages(): Promise<MdxPage[]> {
  const paths = sync(`${blogPostsPath}/**/*.mdx`)

  const pages = await Promise.all(
    paths.map(async path => {
      const slug = path
        .replace(blogPostsPath, '')
        .replace('.mdx', '')
        .replace('/', '')

      return {
        slug,
        ...(await bundleMDX({
          file: path,
          // cwd: '/Users/sitek/sandbox/remix-mdx-blog-demo',
        })),
      }
    }),
  )

  return pages
}

/**
 * Use when you want to display a list of blog posts, and you don't need the full content.
 */
export async function getBlogMdxListItems(): Promise<MdxListItem[]> {
  const pages = await getBlogMdxPages()
  return pages.map(({ code, ...page }) => page)
}

export async function getBlogMdxPage(slug: string) {
  const page = await bundleMDX({
    file: `${blogPostsPath}/${slug}.mdx`,
  })

  return page
}
