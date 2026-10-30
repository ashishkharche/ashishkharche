import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { inlineScripts, pagePolicy, withPolicy } from '~/lib/csp'

const html =
  '<html><head><script>a()</script><script type="application/ld+json">{"x":1}</script>' +
  '<script type="module" src="/assets/x.js"></script></head><body><script data-x="">b()</script></body></html>'

describe('csp', () => {
  it('collects only inline scripts that run', () => {
    expect(inlineScripts(html)).toEqual(['a()', 'b()'])
  })
  it('allows each inline script by hash and nothing else inline', () => {
    const policy = pagePolicy(html)
    const hash = createHash('sha256').update('a()').digest('base64')
    expect(policy).toContain(`'sha256-${hash}'`)
    expect(policy).toContain("style-src 'self'")
    expect(policy).not.toContain('unsafe-inline')
  })
  it('puts the policy before the first script', () => {
    const out = withPolicy(html)
    expect(out.indexOf('Content-Security-Policy')).toBeLessThan(out.indexOf('<script'))
    expect(() => withPolicy(out)).toThrow()
  })
})
