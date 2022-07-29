import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import * as postA from './posts/a.md'
import * as postB from './posts/b.md'

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
  // Return metadata about each of the posts for display on the index page.
  // Referencing the posts here instead of in the Index component down below
  // lets us avoid bundling the actual posts themselves in the bundle for the
  // index page.
  return json([postFromModule(postA), postFromModule(postB)])
}

export default function Index() {
  const posts = useLoaderData<Post[]>()

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link to={`posts/${post.slug}`}>{post.title}</Link>
            {post.description ? <p>{post.description}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  )
}
