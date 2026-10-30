import { describe, expect, it } from 'vitest'
import { absoluteUrl, normalisePath, sectionFor } from '~/lib/urls'

describe('normalisePath', () => {
  it.each([
    ['', '/'],
    ['/', '/'],
    ['work', '/work/'],
    ['/work', '/work/'],
    ['/notes/workout-director-1', '/notes/workout-director-1/'],
    ['//about//', '/about/'],
  ])('%s -> %s', (input, expected) => {
    expect(normalisePath(input)).toBe(expected)
  })
})

describe('absoluteUrl', () => {
  it('uses the live domain with a trailing slash for pages', () => {
    expect(absoluteUrl('/work')).toBe('https://ashishkharche.com/work/')
    expect(absoluteUrl('/')).toBe('https://ashishkharche.com/')
  })
  it('keeps file paths as they are', () => {
    expect(absoluteUrl('/assets/og.png')).toBe('https://ashishkharche.com/assets/og.png')
  })
  it('leaves absolute URLs alone', () => {
    expect(absoluteUrl('https://example.com/x')).toBe('https://example.com/x')
  })
})

describe('sectionFor', () => {
  it('maps nested pages to their nav section', () => {
    expect(sectionFor('/projects/workout-director/')).toBe('/projects/')
    expect(sectionFor('/notes/')).toBe('/notes/')
    expect(sectionFor('/')).toBeUndefined()
  })
})
