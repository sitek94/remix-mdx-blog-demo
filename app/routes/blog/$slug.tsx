import * as React from 'react'
import type { LoaderFunction } from '@remix-run/node'

import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getMDXComponent } from 'mdx-bundler/client'
import { getPost } from './get-post.server'

export const loader: LoaderFunction = async ({ params }) => {
  return json({ slug: params.slug, ...(await getPost()) })
}

export default function PostSlug() {
  const { slug, code, frontmatter } = useLoaderData()

  return (
    <main>
      <h1>Some Post: {slug}</h1>
      <Post code={code} frontmatter={frontmatter} />
      <Link to="/">Go back</Link>
    </main>
  )
}

function Post({ code, frontmatter }) {
  // it's generally a good idea to memoize this function call to
  // avoid re-creating the component every render.

  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <>
      <header>
        <h1>{frontmatter.title}</h1>
        <p>{frontmatter.description}</p>
      </header>
      <main>
        <Component />
      </main>
    </>
  )
}
