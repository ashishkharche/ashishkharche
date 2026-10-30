import * as stylex from '@stylexjs/stylex'

const DARK = '@media (prefers-color-scheme: dark)'

/**
 * Colour tokens. The defaults follow the system setting; the light and dark
 * themes below override them when someone picks a theme with the toggle.
 */
export const colors = stylex.defineVars({
  bg: { default: '#ffffff', [DARK]: '#0c0d0e' },
  text: { default: '#090a0b', [DARK]: '#f1f6f3' },
  muted: { default: '#4d5755', [DARK]: '#a9b2bc' },
  line: { default: '#d9e1dd', [DARK]: '#262a2d' },
  accent: { default: '#090a0b', [DARK]: '#f1f6f3' },
  accentLine: {
    default: 'rgb(9 10 11 / 0.35)',
    [DARK]: 'rgb(241 246 243 / 0.4)',
  },
  soft: { default: '#eef2f0', [DARK]: '#16191b' },
  panel: { default: '#e8eeeb', [DARK]: '#1b1f21' },
  diagramEdge: { default: '#95a3a1', [DARK]: '#5f6a6c' },
  phoneEdge: { default: 'rgb(9 10 11 / 0.08)', [DARK]: 'rgb(255 255 255 / 0.12)' },
  scheme: { default: 'light', [DARK]: 'dark' },
  // Which theme icon to show on the toggle.
  sunDisplay: { default: 'block', [DARK]: 'none' },
  moonDisplay: { default: 'none', [DARK]: 'block' },
})

const light = {
  bg: '#ffffff',
  text: '#090a0b',
  muted: '#4d5755',
  line: '#d9e1dd',
  accent: '#090a0b',
  accentLine: 'rgb(9 10 11 / 0.35)',
  soft: '#eef2f0',
  panel: '#e8eeeb',
  diagramEdge: '#95a3a1',
  phoneEdge: 'rgb(9 10 11 / 0.08)',
  scheme: 'light',
  sunDisplay: 'block',
  moonDisplay: 'none',
}

const dark = {
  bg: '#0c0d0e',
  text: '#f1f6f3',
  muted: '#a9b2bc',
  line: '#262a2d',
  accent: '#f1f6f3',
  accentLine: 'rgb(241 246 243 / 0.4)',
  soft: '#16191b',
  panel: '#1b1f21',
  diagramEdge: '#5f6a6c',
  phoneEdge: 'rgb(255 255 255 / 0.12)',
  scheme: 'dark',
  sunDisplay: 'none',
  moonDisplay: 'block',
}

export const lightTheme = stylex.createTheme(colors, light)
export const darkTheme = stylex.createTheme(colors, dark)

export const fonts = stylex.defineConsts({
  sans: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
})

export const layout = stylex.defineConsts({
  wide: '1040px',
  column: '680px',
  gutter: '2.5rem',
})

export const breakpoints = stylex.defineConsts({
  tablet: '@media (max-width: 760px)',
  phone: '@media (max-width: 560px)',
  desktop: '@media (min-width: 761px)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
})
