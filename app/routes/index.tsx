import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { getBlogMdxListItems } from '../mdx.server'
import type { MdxListItem } from '~/types'

export async function loader() {
  const blogListItems = await getBlogMdxListItems()

  return json(blogListItems)
}

export default function Index() {
  const listItems = useLoaderData<MdxListItem[]>()

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {listItems.map(({ slug, frontmatter: { title } }) => (
          <li key={slug}>
            <Link to={`/blog/${slug}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
