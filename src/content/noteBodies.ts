import type { MDXProps } from 'mdx/types'
import type { ComponentType } from 'react'

const bodies = import.meta.glob<ComponentType<MDXProps>>('../../content/notes/*.mdx', {
  eager: true,
  import: 'default',
})

/** The rendered body of a note. Only the note page imports this. */
export function getNoteBody(slug: string): ComponentType<MDXProps> | undefined {
  const entry = Object.entries(bodies).find(([file]) => file.endsWith(`/${slug}.mdx`))
  return entry?.[1]
}
