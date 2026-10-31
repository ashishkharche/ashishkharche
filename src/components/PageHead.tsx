import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { colors, fonts } from '~/styles/tokens.stylex'

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
    fontFamily: fonts.serif,
    fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
    lineHeight: 1.15,
    textWrap: 'balance',
    fontWeight: 400,
    letterSpacing: '-0.012em',
  },
  lead: {
    marginTop: '1.25rem',
    fontSize: '1.25rem',
    lineHeight: 1.6,
    color: colors.muted,
    maxWidth: '36em',
  },
})
