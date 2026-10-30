/**
 * Company marks and app icons. Where to get them and when they were fetched
 * is in public/assets/logos/SOURCES.md.
 */
export interface Logo {
  /** Shown on the light theme. */
  src: string
  /** Shown on the dark theme, when the mark needs a light version. */
  darkSrc?: string
  width: number
  height: number
  /** App icons get the rounded iOS shape and a hairline edge. */
  appIcon?: boolean
}

const dir = '/assets/logos'

export const logos = {
  paythru: { src: `${dir}/paythru.webp`, width: 107, height: 121 },
  spacexsi: {
    src: `${dir}/spacexsi-dark-ink.svg`,
    darkSrc: `${dir}/spacexsi-light-ink.svg`,
    width: 834,
    height: 318,
  },
  maestro: { src: `${dir}/maestro-dark-ink.svg`, darkSrc: `${dir}/maestro-light-ink.svg`, width: 81, height: 81 },
  kingston: { src: `${dir}/kingston-dark-ink.svg`, darkSrc: `${dir}/kingston-light-ink.svg`, width: 130, height: 130 },
  workoutDirector: { src: `${dir}/workout-director-icon.webp`, width: 96, height: 96, appIcon: true },
  kalo: { src: `${dir}/kalo-icon.webp`, width: 96, height: 96, appIcon: true },
} satisfies Record<string, Logo>

export type LogoName = keyof typeof logos
