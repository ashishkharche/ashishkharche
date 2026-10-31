import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { renderDiagram, readFrontmatter } from '../../plugins/content'
import { findBanned, loadLocalTerms, localTermsFile } from '~/content/rules'

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}

const sources = [...files('content'), ...files('src'), ...files('public'), 'README.md', 'DEPLOY.md', 'STACK.md'].filter(
  (f) => /\.(mdx|mmd|ts|tsx|css|md)$/.test(f) && !f.endsWith('rules.ts') && !f.endsWith('routeTree.gen.ts'),
)

describe('content rules', () => {
  it('flags the things that must not appear', () => {
    expect(findBanned('a realtime model from OpenAI', [])).not.toEqual([])
    expect(findBanned('worked at xAI', [])).not.toEqual([])
    expect(findBanned('SpaceXSI (formerly xAI)', [])).toEqual([])
    expect(findBanned('cut costs by 20%', [])).not.toEqual([])
    expect(findBanned('call +44 1234 567890', [])).not.toEqual([])
    expect(findBanned('date of birth', [])).not.toEqual([])
    expect(findBanned('published on the App Store', [])).toEqual([])
  })

  it('reads extra terms from a local list', () => {
    expect(findBanned('alpha beta', [/beta/i])).toEqual(['matches line 1 of the local terms list'])
    expect(findBanned('alpha', [/beta/i])).toEqual([])
  })

  it.each(sources)('%s has none of them', (file) => {
    expect(findBanned(readFileSync(file, 'utf8'))).toEqual([])
  })

  it('shows the SpaceXSI role as part-time, Jan 2026 to Oct 2026', async () => {
    const { roles } = await import('~/content/work')
    const role = roles.find((r) => r.org.includes('SpaceXSI'))
    expect(role?.when).toBe('Jan 2026 to Oct 2026')
    expect(role?.role).toMatch(/part-time/)
  })

  const localTerms = loadLocalTerms()
  it.skipIf(!localTerms)('sources match none of the local terms', () => {
    const all = sources.map((f) => readFileSync(f, 'utf8')).join('\n')
    expect(findBanned(all, localTerms ?? [])).toEqual([])
  })
  if (!localTerms) console.info(`Local terms list not found at ${localTermsFile}; skipping that check.`)
})

describe('diagrams', () => {
  it.each(files('content/diagrams'))('%s renders without inline styles and with a title', (file) => {
    const diagram = renderDiagram(readFileSync(file, 'utf8'), 'dx')
    expect(diagram.svg).not.toMatch(/style=|<style|<script/i)
    expect(diagram.svg).toMatch(/role="img" aria-labelledby="dx-title"/)
    expect(diagram.svg).toContain('<title id="dx-title">')
    expect(diagram.width).toBeGreaterThan(100)
  })
})

describe('readFrontmatter', () => {
  it('reads YAML at the top of an MDX file', () => {
    expect(readFrontmatter('---\ntitle: Hello\npart: 2\n---\n\nBody')).toEqual({ title: 'Hello', part: 2 })
    expect(readFrontmatter('No frontmatter')).toEqual({})
  })
})
