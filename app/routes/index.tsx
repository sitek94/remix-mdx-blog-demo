import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getBlogMdxListItemsPaths } from './mdx'

type Post = {
  slug: string
  title: string
  description: string
}

function postFromModule(mod): Post {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ''),
    ...mod.attributes.meta,
  }
}

export async function loader() {
  const paths = getBlogMdxListItemsPaths()

  return json(paths)
}

export default function Index() {
  const data = useLoaderData()
  console.log(data)
  return (
    <main>
      <h1>Blog</h1>
    </main>
  )
}
