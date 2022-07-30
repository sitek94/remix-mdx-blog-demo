import { bundleMDX } from 'mdx-bundler'

export async function getPost() {
  const result = await bundleMDX({
    file: './content/blog/a.md',
    cwd: '/Users/sitek/sandbox/remix-mdx-blog-demo',
  })

  const { code, frontmatter } = result

  return {
    code,
    frontmatter,
  }
}
