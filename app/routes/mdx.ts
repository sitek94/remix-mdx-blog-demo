import path from 'path'
import { sync } from 'glob'

export function getBlogMdxListItemsPaths() {
  const blogPostsPath = path.join(process.cwd(), 'content/blog')
  const paths = sync(`${blogPostsPath}/**/*.mdx`)

  return paths
}
