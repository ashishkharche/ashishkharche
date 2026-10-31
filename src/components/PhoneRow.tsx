import * as stylex from '@stylexjs/stylex'
import type { ScreenId } from '~/content/workoutDirectorScreens'
import { FootageCredit, ScreenPicture } from './Screens'
import { breakpoints, colors } from '~/styles/tokens.stylex'

/**
 * Three Workout Director screens side by side, the middle one set a little
 * higher. They are all from the same dark App Store set, so the row keeps one
 * tone in both themes. On narrow screens the row becomes a sideways scroller
 * that shows one screen and the edge of the next; it is a labelled region that
 * takes keyboard focus, so it can be scrolled with the arrow keys.
 */
export function PhoneRow({
  shots,
  sizes,
  label,
}: {
  shots: [ScreenId, ScreenId, ScreenId]
  sizes: string
  label: string
}) {
  return (
    // The wrapper is a grid item, so it must be allowed to shrink for the row to scroll.
    <div {...stylex.props(styles.wrap)}>
      {/* A scrollable region has to be focusable to be usable with a keyboard. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div role="region" aria-label={label} tabIndex={0} {...stylex.props(styles.scroller)}>
        <ul {...stylex.props(styles.row)}>
          {shots.map((id, index) => {
            const raised = index === 1
            return (
              <li key={id} {...stylex.props(styles.slot, raised && styles.raised)}>
                <ScreenPicture
                  id={id}
                  device="iphone"
                  sizes={sizes}
                  // The first screen leads on phones, where it is the one in view.
                  priority={index === 0}
                  eager={index < 2}
                  xstyle={styles.phone}
                />
              </li>
            )
          })}
        </ul>
      </div>
      <FootageCredit ids={shots} />
    </div>
  )
}

const styles = stylex.create({
  wrap: { minWidth: 0 },
  scroller: {
    // Room for the shadows and the focus ring, which the scroller would otherwise clip.
    paddingBlock: { default: '1.5rem', [breakpoints.narrow]: '1.25rem 2rem' },
    borderRadius: '18px',
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.accent}` },
    outlineOffset: '4px',
    overflowX: { default: 'visible', [breakpoints.narrow]: 'auto' },
    overscrollBehaviorX: 'contain',
    scrollSnapType: { default: 'none', [breakpoints.narrow]: 'x mandatory' },
    scrollBehavior: { default: 'smooth', [breakpoints.reducedMotion]: 'auto' },
    scrollPaddingInline: { default: null, [breakpoints.narrow]: '1.25rem' },
    scrollbarWidth: 'none',
    // Run the scroller to the screen edges on phones, so the next screen peeks in from the side.
    marginInline: { default: null, [breakpoints.narrow]: '-1.25rem' },
  },
  row: {
    listStyle: 'none',
    margin: 0,
    padding: { default: 0, [breakpoints.narrow]: '0 1.25rem' },
    display: { default: 'grid', [breakpoints.narrow]: 'flex' },
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: { default: '2rem', [breakpoints.tablet]: '1.75rem', [breakpoints.narrow]: '1.25rem' },
    alignItems: 'start',
    // In the scroller the screens sit after one another and are not shrunk to fit.
    width: { default: null, [breakpoints.narrow]: 'max-content' },
  },
  slot: {
    paddingTop: { default: '9%', [breakpoints.narrow]: 0 },
    width: { default: null, [breakpoints.narrow]: 'min(62vw, 250px)' },
    flexShrink: 0,
    scrollSnapAlign: 'start',
  },
  raised: { paddingTop: 0 },
  phone: {
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: { default: '18px', [breakpoints.tablet]: '14px' },
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: colors.phoneEdge,
    outlineOffset: '-1px',
    boxShadow: `0 22px 44px -24px ${colors.stageShadow}`,
  },
})
