import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { defaultOgImage, noteOgImages, ogImages } from '~/content/ogImages'
import { notes } from '~/content/notes'
import { site } from '~/content/site'
import { checkPreviewTags, pngSize } from '~/lib/preview'
import { pageMeta } from '~/lib/seo'

const publicDir = join(__dirname, '../../public')

function html(meta: ReturnType<typeof pageMeta>): string {
  return meta
    .map((tag) =>
      'property' in tag
        ? `<meta property="${tag.property}" content="${tag.content}"/>`
        : 'name' in tag
          ? `<meta name="${tag.name}" content="${tag.content}"/>`
          : '',
    )
    .join('')
}

describe('link preview images', () => {
  const images = [defaultOgImage, ogImages.projects, ogImages.workoutDirector, ...Object.values(noteOgImages)]

  it.each(images.map((image) => [image.src, image]))('%s is a 1200x630 PNG with alt text', (_, image) => {
    const file = join(publicDir, image.src)
    expect(existsSync(file)).toBe(true)
    expect(pngSize(readFileSync(file))).toEqual({ width: 1200, height: 630 })
    expect(image.alt.length).toBeGreaterThan(10)
  })

  it('has a card for every note', () => {
    for (const note of notes) expect(Object.keys(noteOgImages), note.slug).toContain(note.slug)
  })

  it('accepts complete tags and reports broken ones', () => {
    const good = html(pageMeta({ path: '/work/', title: 'Work', description: 'Work history.' }))
    expect(checkPreviewTags(good, site.url)).toEqual({ problems: [], imagePath: '/assets/og.png' })
    const relative = good.replaceAll('https://ashishkharche.com/assets/og.png', '/assets/og.png')
    expect(checkPreviewTags(relative, site.url).problems).toContain(
      'og:image is not an absolute https://ashishkharche.com URL: /assets/og.png',
    )
    const noCard = good.replace('summary_large_image', 'summary')
    expect(checkPreviewTags(noCard, site.url).problems).toContain('twitter:card is not summary_large_image')
  })

  it('reads PNG sizes and rejects other files', () => {
    expect(pngSize(new Uint8Array([1, 2, 3]))).toBeUndefined()
  })
})
