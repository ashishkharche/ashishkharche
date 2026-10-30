import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'
import { ui } from '~/styles/ui'

export function SectionHead({
  id,
  title,
  to,
  linkLabel,
}: {
  id: string
  title: string
  to: string
  linkLabel: string
}) {
  return (
    <div {...stylex.props(styles.head)}>
      <h2 id={id} {...stylex.props(ui.h2)}>
        {title}
      </h2>
      <Link to={to} {...stylex.props(ui.link, ui.quietLink, ui.small)}>
        {linkLabel}
      </Link>
    </div>
  )
}

const styles = stylex.create({
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '1rem',
    marginBottom: '1.4rem',
  },
})
