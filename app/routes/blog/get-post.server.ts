import { bundleMDX } from 'mdx-bundler'

export async function getPost(slug: string) {
  const result = await bundleMDX({
    file: `./content/blog/${slug}.mdx`,
    cwd: '/Users/sitek/sandbox/remix-mdx-blog-demo',
  })

  const { code, frontmatter } = result

  return {
    code,
    frontmatter,
  }
}
