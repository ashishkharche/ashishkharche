import * as stylex from '@stylexjs/stylex'
import { darkTheme, lightTheme } from '~/styles/tokens.stylex'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

const themeClasses: Record<Theme, string> = {
  light: stylex.props(lightTheme).className ?? '',
  dark: stylex.props(darkTheme).className ?? '',
}

/**
 * Small script that runs in <head> before the page paints, so a saved theme
 * is applied without a flash. Without a saved choice the system setting wins.
 */
export const themeScript = `(function(){try{var c=${JSON.stringify(themeClasses)};var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(t==='light'||t==='dark'){var r=document.documentElement;r.className+=' '+c[t];r.dataset.theme=t}}catch(e){}})()`

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** The theme currently shown: the saved choice, or the system setting. */
export function currentTheme(): Theme {
  const saved = document.documentElement.dataset.theme
  return saved === 'light' || saved === 'dark' ? saved : systemTheme()
}

const listeners = new Set<() => void>()

export function setTheme(theme: Theme): void {
  const root = document.documentElement
  for (const name of [themeClasses.light, themeClasses.dark]) {
    for (const part of name.split(' ').filter(Boolean)) root.classList.remove(part)
  }
  for (const part of themeClasses[theme].split(' ').filter(Boolean)) root.classList.add(part)
  root.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this page only.
  }
  listeners.forEach((listener) => listener())
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener)
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', listener)
  return () => {
    listeners.delete(listener)
    media.removeEventListener('change', listener)
  }
}
