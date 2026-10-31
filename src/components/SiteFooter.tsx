import * as stylex from '@stylexjs/stylex'
import { site } from '~/content/site'
import { breakpoints, colors } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'
import { Scramble } from './Scramble'

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
              <Scramble>Email</Scramble>
            </a>
          </li>
          <li>
            <a href={site.linkedin} {...stylex.props(ui.link, ui.quietLink)}>
              <Scramble>LinkedIn</Scramble>
            </a>
          </li>
          <li>
            <a href={site.github} {...stylex.props(ui.link, ui.quietLink)}>
              <Scramble>GitHub</Scramble>
            </a>
          </li>
        </ul>
      </div>
      {/* A London riverside drawing across the full width. Decorative, so it has no alt text. */}
      <img
        src="/assets/img/footer-london.svg"
        width={2560}
        height={880}
        alt=""
        loading="lazy"
        decoding="async"
        {...stylex.props(styles.art)}
      />
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
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: '0.75rem',
    columnGap: '2rem',
    paddingTop: '2rem',
    paddingBottom: '2.5rem',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '0.4rem',
    columnGap: '1.25rem',
  },
  // On phones the drawing is shown larger and cropped at the sides, so the middle of the skyline stays readable.
  art: {
    display: 'block',
    width: { default: '100%', [breakpoints.phone]: '170%' },
    maxWidth: { default: '1680px', [breakpoints.phone]: 'none' },
    height: 'auto',
    marginInline: { default: 'auto', [breakpoints.phone]: '-35%' },
    filter: colors.artFilter,
    opacity: colors.artOpacity,
    userSelect: 'none',
    pointerEvents: 'none',
  },
})
