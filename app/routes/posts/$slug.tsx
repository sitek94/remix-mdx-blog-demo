import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

export const loader = async ({ params }) => {
  return json({ slug: params.slug })
}

export default function PostSlug() {
  const { slug } = useLoaderData()
  return (
    <main>
      <h1>Some Post: {slug}</h1>
      <Link to="/">Go back</Link>
    </main>
  )
}
