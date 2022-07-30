import path from 'path'
import { sync } from 'glob'
import { bundleMDX } from 'mdx-bundler'

import type { MdxListItem, MdxPage } from '~/types'

const blogPostsPath = path.join(process.cwd(), 'content/blog')

if (process.platform === 'win32') {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'esbuild.exe',
  )
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'bin',
    'esbuild',
  )
}

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
  const { default: remarkMdxImages } = await import('remark-mdx-images')

  const page = await bundleMDX({
    file: `${blogPostsPath}/${slug}.mdx`,
    cwd: process.cwd(),
    mdxOptions: options => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkMdxImages,
      ]

      return options
    },
    esbuildOptions: options => {
      // Set the `outdir` to a public location for this bundle.
      options.outdir = `${process.cwd()}/public/images/blog`
      options.loader = {
        ...options.loader,
        // Tell esbuild to use the `file` loader for pngs
        '.png': 'file',
      }
      // Set the public path to /img/about
      options.publicPath = '/images/blog'

      // Set write to true so that esbuild will output the files.
      options.write = true

      return options
    },
  })

  return page
}
