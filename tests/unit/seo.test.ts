import { describe, expect, it } from 'vitest'
import { documentTitle, seo } from '~/lib/seo'

describe('seo', () => {
  it('builds titles', () => {
    expect(documentTitle({ title: 'Work' })).toBe('Work · Ashish Kharche')
    expect(documentTitle({})).toBe('Ashish Kharche')
    expect(documentTitle({ title: 'x', fullTitle: 'Full' })).toBe('Full')
  })

  it('adds canonical, Open Graph and Twitter tags', () => {
    const head = seo({ path: '/work', title: 'Work', description: 'Work history.' })
    expect(head.links).toEqual([{ rel: 'canonical', href: 'https://ashishkharche.com/work/' }])
    expect(head.meta).toContainEqual({ property: 'og:url', content: 'https://ashishkharche.com/work/' })
    expect(head.meta).toContainEqual({ property: 'og:image', content: 'https://ashishkharche.com/assets/og.png' })
    expect(head.meta).toContainEqual({ name: 'twitter:card', content: 'summary_large_image' })
    expect(head.meta).toContainEqual({ name: 'description', content: 'Work history.' })
  })

  it('marks the 404 page noindex and gives it no canonical link', () => {
    const head = seo({ path: '/404/', title: 'Page not found', description: 'Page not found.', noindex: true })
    expect(head.links).toEqual([])
    expect(head.meta).toContainEqual({ name: 'robots', content: 'noindex' })
  })
})
