import { site } from '~/content/site'

/** Normalises a site path so it starts and ends with a slash, e.g. `work` -> `/work/`. */
export function normalisePath(path: string): string {
  const trimmed = path.trim().replace(/^\/+|\/+$/g, '')
  return trimmed === '' ? '/' : `/${trimmed}/`
}

/** Absolute URL on the live domain, used for canonical links and Open Graph tags. */
export function absoluteUrl(path: string, base: string = site.url): string {
  if (/^https?:\/\//.test(path)) return path
  const isFile = /\.[a-z0-9]+$/i.test(path)
  const clean = isFile ? `/${path.replace(/^\/+/, '')}` : normalisePath(path)
  return `${base.replace(/\/+$/, '')}${clean}`
}

/** Section of the main navigation that a path belongs to, if any. */
export function sectionFor(path: string): string | undefined {
  const clean = normalisePath(path)
  if (clean === '/') return undefined
  const first = clean.split('/')[1]
  return first ? `/${first}/` : undefined
}
