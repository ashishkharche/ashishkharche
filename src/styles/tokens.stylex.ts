import * as stylex from '@stylexjs/stylex'

const DARK = '@media (prefers-color-scheme: dark)'

/**
 * Colour tokens. The defaults follow the system setting; the light and dark
 * themes below override them when someone picks a theme with the toggle.
 */
export const colors = stylex.defineVars({
  bg: { default: '#faf8f3', [DARK]: '#0c0d0e' },
  // A very light paper grain tiled over the background (a static SVG, drawn once).
  grain: { default: 'url("/assets/img/grain.svg")', [DARK]: 'url("/assets/img/grain-dark.svg")' },
  // The footer drawing is black line art; dark mode turns it light.
  artFilter: { default: 'none', [DARK]: 'invert(1)' },
  artOpacity: { default: '0.42', [DARK]: '0.3' },
  text: { default: '#090a0b', [DARK]: '#f1f6f3' },
  muted: { default: '#4d5755', [DARK]: '#a9b2bc' },
  line: { default: '#d9e1dd', [DARK]: '#262a2d' },
  accent: { default: '#090a0b', [DARK]: '#f1f6f3' },
  accentLine: {
    default: 'rgb(9 10 11 / 0.35)',
    [DARK]: 'rgb(241 246 243 / 0.4)',
  },
  soft: { default: '#eef2f0', [DARK]: '#16191b' },
  // Code blocks: a neutral light grey, not the green-tinted soft colour.
  codeBg: { default: '#f6f7f8', [DARK]: '#141618' },
  codeLine: { default: '#e3e6e8', [DARK]: '#262a2d' },
  panel: { default: '#e8eeeb', [DARK]: '#1b1f21' },
  diagramEdge: { default: '#95a3a1', [DARK]: '#5f6a6c' },
  phoneEdge: { default: 'rgb(9 10 11 / 0.08)', [DARK]: 'rgb(255 255 255 / 0.12)' },
  // The backdrop behind the app screens: a soft panel with a light glow at the top.
  stage: { default: '#e6ece9', [DARK]: '#131618' },
  stageGlow: { default: 'rgb(255 255 255 / 0.85)', [DARK]: 'rgb(255 255 255 / 0.07)' },
  stageShadow: { default: 'rgb(9 10 11 / 0.32)', [DARK]: 'rgb(0 0 0 / 0.7)' },
  scheme: { default: 'light', [DARK]: 'dark' },
  // Which theme icon to show on the toggle.
  sunDisplay: { default: 'block', [DARK]: 'none' },
  moonDisplay: { default: 'none', [DARK]: 'block' },
})

const light = {
  bg: '#faf8f3',
  grain: 'url("/assets/img/grain.svg")',
  artFilter: 'none',
  artOpacity: '0.42',
  text: '#090a0b',
  muted: '#4d5755',
  line: '#d9e1dd',
  accent: '#090a0b',
  accentLine: 'rgb(9 10 11 / 0.35)',
  soft: '#eef2f0',
  codeBg: '#f6f7f8',
  codeLine: '#e3e6e8',
  panel: '#e8eeeb',
  diagramEdge: '#95a3a1',
  phoneEdge: 'rgb(9 10 11 / 0.08)',
  stage: '#e6ece9',
  stageGlow: 'rgb(255 255 255 / 0.85)',
  stageShadow: 'rgb(9 10 11 / 0.32)',
  scheme: 'light',
  sunDisplay: 'block',
  moonDisplay: 'none',
}

const dark = {
  bg: '#0c0d0e',
  grain: 'url("/assets/img/grain-dark.svg")',
  artFilter: 'invert(1)',
  artOpacity: '0.3',
  text: '#f1f6f3',
  muted: '#a9b2bc',
  line: '#262a2d',
  accent: '#f1f6f3',
  accentLine: 'rgb(241 246 243 / 0.4)',
  soft: '#16191b',
  codeBg: '#141618',
  codeLine: '#262a2d',
  panel: '#1b1f21',
  diagramEdge: '#5f6a6c',
  phoneEdge: 'rgb(255 255 255 / 0.12)',
  stage: '#131618',
  stageGlow: 'rgb(255 255 255 / 0.07)',
  stageShadow: 'rgb(0 0 0 / 0.7)',
  scheme: 'dark',
  sunDisplay: 'none',
  moonDisplay: 'block',
}

export const lightTheme = stylex.createTheme(colors, light)
export const darkTheme = stylex.createTheme(colors, dark)

export const fonts = stylex.defineConsts({
  sans: 'Geist, "Geist Fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  // Display headings. Geist Serif has one weight, so headings set in it use 400.
  serif: '"Geist Serif", "Geist Serif Fallback", ui-serif, Georgia, serif',
})

export const layout = stylex.defineConsts({
  wide: '1040px',
  column: '680px',
  gutter: '2.5rem',
})

export const breakpoints = stylex.defineConsts({
  tablet: '@media (max-width: 760px)',
  phone: '@media (max-width: 560px)',
  // Below this the hero screens become a sideways scroller instead of three in a row.
  narrow: '@media (max-width: 640px)',
  desktop: '@media (min-width: 761px)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
})
