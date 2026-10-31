import * as stylex from '@stylexjs/stylex'
import { screenshotSrc, screenshotSrcSet } from '~/content/projects'
import type { ScreenId } from '~/content/workoutDirectorScreens'
import { ScreenPicture } from './Screens'
import { breakpoints, colors } from '~/styles/tokens.stylex'

/** A Kalo screenshot by file stem, or a Workout Director App Store screen by id. */
export type PhoneShot = { kalo: string } | { workoutDirector: ScreenId }

/**
 * Three app screenshots side by side, the middle one set a little higher.
 * Decorative: the same screens appear, described, in the projects below.
 */
export function PhoneRow({ shots, sizes }: { shots: [PhoneShot, PhoneShot, PhoneShot]; sizes: string }) {
  return (
    <div aria-hidden="true" {...stylex.props(styles.row)}>
      {shots.map((shot, index) => {
        const raised = index === 1
        return (
          <div key={index} {...stylex.props(styles.slot, raised && styles.raised)}>
            {'kalo' in shot ? (
              <img
                src={screenshotSrc(shot.kalo)}
                srcSet={screenshotSrcSet(shot.kalo)}
                sizes={sizes}
                width={480}
                height={1038}
                alt=""
                decoding="async"
                {...stylex.props(styles.phone)}
              />
            ) : (
              <ScreenPicture
                id={shot.workoutDirector}
                device="iphone"
                sizes={sizes}
                alt=""
                priority={raised}
                eager
                xstyle={styles.phone}
              />
            )}
          </div>
        )
      })}
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
  slot: { paddingTop: '9%' },
  raised: { paddingTop: 0 },
  phone: {
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: { default: '16px', [breakpoints.tablet]: '10px' },
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: colors.phoneEdge,
    outlineOffset: '-1px',
    boxShadow: `0 18px 36px -20px ${colors.stageShadow}`,
  },
})
