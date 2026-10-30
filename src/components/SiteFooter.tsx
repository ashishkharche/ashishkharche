import * as stylex from '@stylexjs/stylex'
import { site } from '~/content/site'
import { colors } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer {...stylex.props(styles.footer)}>
      <div {...stylex.props(ui.wrap, styles.row)}>
        <p>
          © {year} {site.name} · {site.city}
        </p>
        <ul role="list" aria-label="Elsewhere" {...stylex.props(styles.list)}>
          <li>
            <a href={`mailto:${site.email}`} {...stylex.props(ui.link, ui.quietLink)}>
              Email
            </a>
          </li>
          <li>
            <a href={site.linkedin} {...stylex.props(ui.link, ui.quietLink)}>
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.github} {...stylex.props(ui.link, ui.quietLink)}>
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

const styles = stylex.create({
  footer: {
    marginTop: '5rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    color: colors.muted,
    fontSize: '0.95rem',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: '0.75rem',
    columnGap: '2rem',
    paddingTop: '2rem',
    paddingBottom: '3rem',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '0.4rem',
    columnGap: '1.25rem',
  },
})
