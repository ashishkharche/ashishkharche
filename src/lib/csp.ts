import { createHash } from 'node:crypto'

/** Contents of every inline <script> that the browser would run (JSON-LD is data, not code). */
export function inlineScripts(html: string): string[] {
  const scripts: string[] = []
  for (const match of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
    const attrs = match[1] ?? ''
    const body = match[2] ?? ''
    if (/\ssrc=/i.test(attrs)) continue
    if (/type="application\/(ld\+)?json"/i.test(attrs)) continue
    scripts.push(body)
  }
  return scripts
}

export function sha256Source(script: string): string {
  return `'sha256-${createHash('sha256').update(script, 'utf8').digest('base64')}'`
}

/**
 * Content-Security-Policy for one page. Inline scripts are allowed by hash
 * only, styles must come from files, and nothing loads from other origins.
 * frame-ancestors cannot be set from a meta tag; it is sent as a header.
 */
export function pagePolicy(html: string): string {
  const hashes = [...new Set(inlineScripts(html).map(sha256Source))]
  return [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self'",
    "font-src 'self'",
    `script-src 'self' ${hashes.join(' ')}`.trim(),
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ')
}

/** Adds the policy as the first element in <head>, before any script. */
export function withPolicy(html: string): string {
  if (html.includes('http-equiv="Content-Security-Policy"')) throw new Error('Page already has a CSP meta tag')
  const policy = pagePolicy(html)
  return html.replace(/<head>/i, `<head><meta http-equiv="Content-Security-Policy" content="${policy}"/>`)
}
