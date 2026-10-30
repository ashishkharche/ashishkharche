import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { screenshotSrc, screenshotSrcSet, type Screenshot } from '~/content/projects'
import { breakpoints, colors, layout } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

/** Three phone screenshots side by side, with a caption. */
export function Shots({ shots, caption }: { shots: Screenshot[]; caption: string }) {
  return (
    <figure {...stylex.props(styles.shots)}>
      {shots.map((shot) => (
        <img
          key={shot.name}
          src={screenshotSrc(shot.name)}
          srcSet={screenshotSrcSet(shot.name)}
          sizes="(max-width: 560px) 30vw, 210px"
          width={480}
          height={1038}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          {...stylex.props(styles.shot)}
        />
      ))}
      <figcaption {...stylex.props(styles.caption, styles.fullRow)}>{caption}</figcaption>
    </figure>
  )
}

/** A sideways-scrolling strip of screenshots, wider than the text column. */
export function Gallery({ shots, label }: { shots: Screenshot[]; label: string }) {
  return (
    <div role="group" aria-label={label} tabIndex={0} {...stylex.props(styles.gallery, ui.focusRing)}>
      {shots.map((shot) => (
        <img
          key={shot.name}
          src={screenshotSrc(shot.name)}
          srcSet={screenshotSrcSet(shot.name)}
          sizes="(max-width: 560px) 180px, 230px"
          width={480}
          height={1038}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          {...stylex.props(styles.galleryImg)}
        />
      ))}
    </div>
  )
}

/** Large screenshots straight on the page at the top of a case study. */
export function HeroMedia({ shots }: { shots: Screenshot[] }) {
  return (
    <div role="group" aria-label="App Store screenshots" {...stylex.props(styles.hero)}>
      {shots.map((shot) => (
        <img
          key={shot.name}
          src={screenshotSrc(shot.name)}
          srcSet={screenshotSrcSet(shot.name)}
          sizes="(max-width: 760px) 30vw, 310px"
          width={480}
          height={1038}
          alt={shot.alt}
          decoding="async"
          {...stylex.props(styles.heroImg)}
        />
      ))}
    </div>
  )
}

export interface ThemedImage {
  /** File stem in /assets/img: `<name>-light.webp` and `<name>-dark.webp`. */
  name: string
  alt: string
  width: number
  height: number
}

/**
 * Images with a light and a dark version, side by side. Only the version for the
 * current theme is shown, so it follows both the system setting and the toggle.
 */
export function ThemedFigures({ images, caption }: { images: ThemedImage[]; caption: string }) {
  return (
    <figure {...stylex.props(styles.themed)}>
      {images.map((image) => (
        <div key={image.name}>
          {(['light', 'dark'] as const).map((theme) => (
            <img
              key={theme}
              src={`/assets/img/${image.name}-${theme}.webp`}
              width={image.width}
              height={image.height}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              {...stylex.props(styles.themedImg, theme === 'light' ? styles.onlyLight : styles.onlyDark)}
            />
          ))}
        </div>
      ))}
      <figcaption {...stylex.props(styles.caption, styles.fullRow)}>{caption}</figcaption>
    </figure>
  )
}

export function Facts({ items }: { items: Array<{ term: string; detail: ReactNode }> }) {
  return (
    <dl {...stylex.props(styles.facts)}>
      {items.map((item) => (
        <div key={item.term}>
          <dt {...stylex.props(styles.term)}>{item.term}</dt>
          <dd {...stylex.props(styles.detail)}>{item.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

const styles = stylex.create({
  shots: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: { default: '1rem', [breakpoints.phone]: '0.6rem' },
    marginBlock: '2.25rem',
  },
  shot: {
    width: '100%',
    borderRadius: { default: '16px', [breakpoints.phone]: '10px' },
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: colors.phoneEdge,
    outlineOffset: '-1px',
  },
  themed: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: { default: '1rem', [breakpoints.phone]: '0.5rem' },
    marginBlock: '2.25rem',
  },
  themedImg: { width: '100%', height: 'auto' },
  onlyLight: { display: colors.sunDisplay },
  onlyDark: { display: colors.moonDisplay },
  fullRow: { gridColumnStart: 1, gridColumnEnd: -1 },
  caption: {
    marginTop: '0.7rem',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    color: colors.muted,
  },
  gallery: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    paddingBottom: '0.75rem',
    scrollbarWidth: 'thin',
    scrollSnapType: 'x mandatory',
    outlineOffset: { default: null, ':focus-visible': '4px' },
  },
  galleryImg: {
    flex: 'none',
    width: { default: '230px', [breakpoints.phone]: '180px' },
    borderRadius: '16px',
    scrollSnapAlign: 'start',
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: colors.phoneEdge,
    outlineOffset: '-1px',
  },
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: { default: '3.5rem', [breakpoints.tablet]: '2.5rem' },
  },
  heroImg: {
    display: 'block',
    flex: 'none',
    width: { default: '30%', [breakpoints.tablet]: '31.5%' },
    borderRadius: { default: '22px', [breakpoints.tablet]: '12px' },
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: colors.phoneEdge,
    outlineOffset: '-1px',
  },
  facts: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr 1.6fr 1fr 1fr', [breakpoints.tablet]: '1fr 1fr' },
    rowGap: '1.25rem',
    columnGap: '2rem',
    marginTop: '2.25rem',
    paddingBlock: '1.25rem',
    borderBlockWidth: '1px',
    borderBlockStyle: 'solid',
    borderBlockColor: colors.line,
    maxWidth: layout.column,
  },
  term: { color: colors.muted, fontSize: '0.95rem' },
  detail: { marginTop: '0.15rem', fontSize: '1rem' },
})
