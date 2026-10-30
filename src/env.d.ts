/// <reference types="vite/client" />

declare module '*.mmd' {
  const diagram: { id: string; svg: string; width: number; height: number }
  export default diagram
}

declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types'
  import type { JSX } from 'react'
  export const frontmatter: Record<string, unknown>
  export default function MDXContent(props: MDXProps): JSX.Element
}
