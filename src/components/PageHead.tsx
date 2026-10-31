import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { colors } from '~/styles/tokens.stylex'

export function PageHead({ title, lead, icon }: { title: string; lead?: ReactNode; icon?: ReactNode }) {
  return (
    <header>
      {icon ? <div {...stylex.props(styles.icon)}>{icon}</div> : null}
      <h1 {...stylex.props(styles.title)}>{title}</h1>
      {lead ? <p {...stylex.props(styles.lead)}>{lead}</p> : null}
    </header>
  )
}

const styles = stylex.create({
  icon: { marginBottom: '1rem' },
  title: {
    fontSize: 'clamp(1.9rem, 4.6vw, 2.5rem)',
    lineHeight: 1.15,
    textWrap: 'balance',
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  lead: {
    marginTop: '0.9rem',
    fontSize: '1.25rem',
    lineHeight: 1.5,
    color: colors.muted,
    maxWidth: '36em',
  },
})
