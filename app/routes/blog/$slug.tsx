import * as React from 'react'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getMDXComponent } from 'mdx-bundler/client'

import { getBlogMdxPage } from '~/mdx.server'
import type { MdxPage } from '~/types'

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug
  const page = await getBlogMdxPage(slug)

  return json(page)
}

export const meta: MetaFunction = ({ data }: { data: MdxPage }) => {
  return {
    title: data.frontmatter.title,
  }
}

export default function BlogSlug() {
  const { code, frontmatter } = useLoaderData()
  return (
    <>
      <nav>
        <Link to="/">Go back</Link>
      </nav>
      <Post code={code} frontmatter={frontmatter} />
    </>
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
      </header>
      <main>
        <Component />
      </main>
    </>
  )
}
