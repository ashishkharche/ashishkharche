import * as stylex from '@stylexjs/stylex'
import { screenshotSrc, screenshotSrcSet, type Screenshot } from '~/content/projects'
import { breakpoints, colors } from '~/styles/tokens.stylex'

/**
 * Three app screenshots side by side, upright and evenly spaced. Decorative:
 * the same screens appear, described, in the projects below.
 */
export function PhoneRow({ shots, sizes }: { shots: [Screenshot, Screenshot, Screenshot]; sizes: string }) {
  return (
    <div aria-hidden="true" {...stylex.props(styles.row)}>
      {shots.map((shot, index) => (
        <img
          key={shot.name}
          src={screenshotSrc(shot.name)}
          srcSet={screenshotSrcSet(shot.name)}
          sizes={sizes}
          width={480}
          height={1038}
          alt=""
          decoding="async"
          fetchPriority={index === 1 ? 'high' : 'auto'}
          {...stylex.props(styles.phone)}
        />
      ))}
    </div>
  )
}

const styles = stylex.create({
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: { default: '1rem', [breakpoints.phone]: '0.6rem' },
    alignItems: 'start',
  },
  phone: {
    display: 'block',
    width: '100%',
    borderRadius: { default: '16px', [breakpoints.tablet]: '10px' },
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: colors.phoneEdge,
    outlineOffset: '-1px',
  },
})
