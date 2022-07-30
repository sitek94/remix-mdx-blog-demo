export type MdxPage = {
  code: string
  slug: string
  frontmatter: {
    title?: string
    description?: string
    meta?: {
      [key: string]: string
    }
  }
}

export type MdxListItem = Omit<MdxPage, 'code'>
