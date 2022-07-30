import fs from 'fs'
import path from 'path'
import { sync } from 'glob'
import { bundleMDX } from 'mdx-bundler'

import type { MdxListItem, MdxPage } from '~/types'

const blogPostsPath = path.join(process.cwd(), 'content/blog')

// Esbuild sometimes can't figure out where to look for its executables
// https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
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
      return {
        slug: slugifyBlogPostPath(path),
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

  const fileOrDirectoryPath = path.join(blogPostsPath, slug)

  // If the path is a directory, we'll try to find the index.mdx file, otherwise we'll just use the path
  const filePath = isDirectory(fileOrDirectoryPath)
    ? path.join(fileOrDirectoryPath, 'index.mdx')
    : `${fileOrDirectoryPath}.mdx`

  const page = await bundleMDX({
    file: filePath,
    cwd: process.cwd(),
    mdxOptions: options => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkMdxImages,
      ]

      return options
    },
    esbuildOptions: options => {
      options.loader = {
        ...options.loader,
        '.png': 'dataurl',
      }

      return options
    },
  })

  return page
}

/**
 * Check if given path is a directory
 */
function isDirectory(path: string) {
  try {
    return fs.lstatSync(path).isDirectory()
  } catch {
    return false
  }
}

function slugifyBlogPostPath(path: string) {
  return (
    path
      // Remove base blog post path
      .replace(blogPostsPath, '')
      // Remove file extension
      .replace('.mdx', '')
      // Remove leading slash
      .replace('/', '')
      // Remove index (for files in directories)
      .replace('/index', '')
  )
}
