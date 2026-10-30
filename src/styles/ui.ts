import * as stylex from '@stylexjs/stylex'
import { breakpoints, colors, layout } from './tokens.stylex'

const focusRing = {
  outline: { default: null, ':focus-visible': `2px solid ${colors.accent}` },
  outlineOffset: { default: null, ':focus-visible': '3px' },
} as const

export const ui = stylex.create({
  wrap: {
    width: `min(100% - ${layout.gutter}, ${layout.wide})`,
    marginInline: 'auto',
  },
  column: {
    width: `min(100% - ${layout.gutter}, ${layout.column})`,
    marginInline: 'auto',
  },
  narrow: { maxWidth: layout.column },
  /** Breaks a block out of the text column to the full content width. */
  wide: {
    width: `min(100vw - ${layout.gutter}, ${layout.wide})`,
    marginLeft: '50%',
    transform: 'translateX(-50%)',
  },
  link: {
    color: { default: colors.text, ':hover': colors.accent },
    textDecorationLine: 'underline',
    textDecorationColor: { default: colors.accentLine, ':hover': colors.accent },
    textDecorationThickness: '1.5px',
    textUnderlineOffset: '3px',
    transitionProperty: 'color, text-decoration-color',
    transitionDuration: '0.15s',
    ...focusRing,
  },
  quietLink: {
    color: { default: colors.muted, ':hover': colors.accent },
  },
  plainLink: {
    textDecorationLine: 'none',
  },
  focusRing,
  muted: { color: colors.muted },
  small: { fontSize: '1rem' },
  visuallyHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  section: {
    marginTop: { default: '4.5rem', [breakpoints.phone]: '3.5rem' },
  },
  h2: {
    fontSize: '1.35rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.005em',
  },
  h3: {
    fontSize: '1.15rem',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  note: { marginTop: '1.5rem', color: colors.muted, fontSize: '1rem' },
  mt06: { marginTop: '0.6rem' },
  mt1: { marginTop: '1rem' },
  mt2: { marginTop: '2rem' },
})
