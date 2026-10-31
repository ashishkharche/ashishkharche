import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'
import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { CodeBlock } from '~/components/CodeBlock'
import { colors, fonts } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

/** Container for long-form text: case studies, notes and the About page. */
export function Prose({
  children,
  as: Tag = 'div',
  ...rest
}: { children: ReactNode; as?: 'div' | 'article' } & Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'style'>) {
  return (
    <Tag {...rest} {...stylex.props(styles.prose)}>
      {children}
    </Tag>
  )
}

function Anchor({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...stylex.props(ui.link)}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} {...rest} {...stylex.props(ui.link)}>
      {children}
    </a>
  )
}

/** Paragraph helpers for MDX, e.g. <Muted>…</Muted>. */
export function Muted({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.block, ui.muted)}>{children}</div>
}

export function Lead({ children }: { children: ReactNode }) {
  return <p {...stylex.props(styles.block, styles.lead)}>{children}</p>
}

export const mdxComponents: MDXComponents = {
  a: Anchor,
  p: ({ children }) => <p {...stylex.props(styles.block)}>{children}</p>,
  h2: ({ children }) => <h2 {...stylex.props(ui.h2, styles.h2)}>{children}</h2>,
  h3: ({ children }) => <h3 {...stylex.props(ui.h3, styles.h3)}>{children}</h3>,
  ul: ({ children }) => <ul {...stylex.props(styles.block, styles.list)}>{children}</ul>,
  ol: ({ children }) => <ol {...stylex.props(styles.block, styles.list)}>{children}</ol>,
  li: ({ children }) => <li {...stylex.props(styles.item)}>{children}</li>,
  // Inline `code` gets the chip style. Code inside a fenced block is marked by Shiki and left plain.
  code: ({ children, ...rest }: ComponentPropsWithoutRef<'code'> & { 'data-language'?: string }) =>
    rest['data-language'] ? <code>{children}</code> : <code {...stylex.props(styles.code)}>{children}</code>,
  pre: CodeBlock,
}

const styles = stylex.create({
  prose: {},
  block: {
    marginTop: { default: '1.1rem', ':first-child': 0 },
  },
  lead: { fontSize: '1.25rem', lineHeight: 1.55 },
  h2: {
    marginTop: { default: '3rem', ':first-child': 0 },
    fontSize: '1.45rem',
  },
  h3: { marginTop: { default: '2rem', ':first-child': 0 } },
  list: { paddingLeft: '1.25rem' },
  item: {
    marginTop: { default: '0.45rem', ':first-child': 0 },
    '::marker': { color: colors.muted },
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: '0.86em',
    backgroundColor: colors.codeBg,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.codeLine,
    overflowWrap: 'break-word',
    paddingBlock: '0.05em',
    paddingInline: '0.35em',
    borderRadius: '5px',
  },
})
