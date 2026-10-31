import { expect, test, type Page } from '@playwright/test'
import { headings, routes } from './routes'

const siteUrl = 'https://ashishkharche.com'
const notePaths = routes.filter((path) => /^\/notes\/[a-z0-9-]+\/$/.test(path))
const forbidden =
  /"(telephone|faxNumber|address|birthDate|birthPlace|nationality|homeLocation)"|\bvisa\b|sponsor|right to work|available now|open to work/i

async function jsonLd(page: Page): Promise<Array<Record<string, unknown>>> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.map((text) => JSON.parse(text) as Record<string, unknown>)
}

for (const path of routes) {
  test(`${path} links the notes feed from its head`, async ({ page }) => {
    await page.goto(path)
    const link = page.locator('head link[rel="alternate"][type="application/atom+xml"]')
    await expect(link).toHaveCount(1)
    await expect(link).toHaveAttribute('href', '/feed.xml')
    await expect(link).toHaveAttribute('title', /Notes/)
  })
}

test('the feed lists every note with its published and updated dates', async ({ request, page }) => {
  const response = await request.get('/feed.xml')
  expect(response.status()).toBe(200)
  const xml = await response.text()
  expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom"')
  expect(xml).toContain(`<link rel="self" type="application/atom+xml" href="${siteUrl}/feed.xml"/>`)
  expect(xml).not.toMatch(forbidden)
  for (const path of notePaths) {
    expect(xml).toContain(`<id>${siteUrl}${path}</id>`)
    expect(xml).toContain(`<title>${headings[path]}</title>`)
    await page.goto(path)
    const post = (await jsonLd(page)).find((data) => data['@type'] === 'BlogPosting')
    const entry = xml.slice(xml.indexOf(`<id>${siteUrl}${path}</id>`))
    expect(entry).toContain(`<published>${String(post?.datePublished)}T00:00:00Z</published>`)
    expect(entry).toContain(`<updated>${String(post?.dateModified)}T00:00:00Z</updated>`)
  }
})

test('the Notes page links the feed in its text', async ({ page }) => {
  await page.goto('/notes/')
  const link = page.getByRole('link', { name: 'Atom feed' })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '/feed.xml')
})

test('About has ProfilePage data about the person, with no private details', async ({ page }) => {
  await page.goto('/about/')
  const data = await jsonLd(page)
  const profile = data.find((item) => item['@type'] === 'ProfilePage')
  expect(profile).toBeTruthy()
  const person = profile?.mainEntity as Record<string, unknown>
  expect(person['@type']).toBe('Person')
  expect(person.name).toBe('Ashish Kharche')
  expect(person['@id']).toBe(`${siteUrl}/#person`)
  expect(JSON.stringify(data)).not.toMatch(forbidden)
})

for (const path of notePaths) {
  test(`${path} has BlogPosting data that matches the page`, async ({ page }) => {
    await page.goto(path)
    const data = await jsonLd(page)
    const post = data.find((item) => item['@type'] === 'BlogPosting')
    expect(post).toBeTruthy()
    expect(post?.headline).toBe(headings[path])
    expect(post?.url).toBe(`${siteUrl}${path}`)
    expect(post?.datePublished).toBe(await page.locator('article header time').getAttribute('datetime'))
    expect(String(post?.dateModified) >= String(post?.datePublished)).toBe(true)
    expect((post?.author as Record<string, unknown>)['@id']).toBe(`${siteUrl}/#person`)
    expect(JSON.stringify(data)).not.toMatch(forbidden)
  })
}

test('the home page data has no private details', async ({ page }) => {
  await page.goto('/')
  const data = await jsonLd(page)
  expect(JSON.stringify(data)).toContain('"WebSite"')
  expect(JSON.stringify(data)).not.toMatch(forbidden)
})

test('the sitemap gives each note the date it last changed', async ({ request, page }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const path of routes)
    expect(xml).toMatch(new RegExp(`<loc>${siteUrl}${path}</loc><lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`))
  for (const path of notePaths) {
    await page.goto(path)
    const post = (await jsonLd(page)).find((item) => item['@type'] === 'BlogPosting')
    expect(xml).toContain(`<loc>${siteUrl}${path}</loc><lastmod>${String(post?.dateModified)}</lastmod>`)
  }
})
