import * as stylex from '@stylexjs/stylex'
import { links, site } from '~/content/site'
import { colors } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

/** Short availability note with the phone-free CV downloads. Used on the home, work and about pages. */
export function Availability({ email = true }: { email?: boolean }) {
  return (
    <div {...stylex.props(styles.box)}>
      <p>
        <strong {...stylex.props(styles.strong)}>Available now</strong> for roles in London. I&apos;m on a UK Skilled
        Worker visa, so a new employer would need to sponsor me.
      </p>
      <p {...stylex.props(ui.mt06)}>
        <a href={links.cv} type="application/pdf" {...stylex.props(ui.link)}>
          Download my CV (PDF)
        </a>
        , or the{' '}
        <a href={links.cvIos} type="application/pdf" {...stylex.props(ui.link)}>
          iOS version (PDF)
        </a>
        .
        {email ? (
          <>
            {' '}
            The best way to reach me is email:{' '}
            <a href={`mailto:${site.email}`} {...stylex.props(ui.link)}>
              {site.email}
            </a>
            .
          </>
        ) : null}
      </p>
    </div>
  )
}

const styles = stylex.create({
  box: {
    marginTop: '1rem',
    paddingBlock: '1rem',
    paddingInline: '1.25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: '0.5rem',
  },
  strong: { fontWeight: 600 },
})
