import { expect, test, type Locator, type Page } from '@playwright/test'

// The three app screens under the intro on the home page.
const region = (page: Page) => page.getByRole('region', { name: 'Workout Director app screens' })

async function box(locator: Locator) {
  const found = await locator.boundingBox()
  if (!found) throw new Error('element is not on the page')
  return found
}

test('the home showcase uses one tone of screen and describes each one', async ({ page }) => {
  await page.goto('/')
  const images = region(page).locator('img')
  await expect(images).toHaveCount(3)
  for (const img of await images.all()) {
    // Only the dark Workout Director set; the light Kalo screenshots are not mixed in.
    expect(await img.getAttribute('src')).toContain('/assets/img/wd/iphone/')
    expect((await img.getAttribute('alt'))?.length).toBeGreaterThan(10)
  }
})

test.describe('on a narrow screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('the screens scroll sideways, one at a time with the next peeking in', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const scroller = region(page)
    const state = await scroller.evaluate((el) => ({
      overflow: el.scrollWidth > el.clientWidth,
      snap: getComputedStyle(el).scrollSnapType,
    }))
    expect(state.overflow).toBe(true)
    expect(state.snap).toBe('x mandatory')

    const items = scroller.locator('li')
    const first = await box(items.nth(0))
    const second = await box(items.nth(1))
    // One screen fits with room to spare, and the start of the next one is on screen.
    expect(first.width).toBeLessThan(390 * 0.75)
    expect(first.width).toBeGreaterThan(390 * 0.5)
    expect(second.x).toBeLessThan(390)
    expect(second.x + second.width).toBeGreaterThan(390)
  })

  test('the scroller can be reached and scrolled with the keyboard', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const scroller = region(page)
    await expect(scroller).toHaveAttribute('tabindex', '0')
    await scroller.focus()
    await expect(scroller).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => scroller.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
  })

  test('the scroller only scrolls smoothly when motion is allowed', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    expect(await region(page).evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe('auto')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    expect(await region(page).evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe('smooth')
  })

  test('there is clear space between the screens and the next heading', async ({ page }) => {
    await page.goto('/')
    const shots = await box(region(page))
    const heading = await box(page.getByRole('heading', { name: 'Selected work' }))
    expect(heading.y - (shots.y + shots.height)).toBeGreaterThanOrEqual(64)
  })
})

test('on a wide screen the three screens sit in one row with room between them', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const scroller = region(page)
  expect(await scroller.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
  const images = scroller.locator('img')
  const [a, b, c] = await Promise.all([box(images.nth(0)), box(images.nth(1)), box(images.nth(2))])
  const gapAfter = (left: { x: number; width: number }, right: { x: number }) => right.x - (left.x + left.width)
  expect(gapAfter(a, b)).toBeGreaterThanOrEqual(28)
  expect(gapAfter(b, c)).toBeGreaterThanOrEqual(28)
  const shots = await box(scroller)
  const heading = await box(page.getByRole('heading', { name: 'Selected work' }))
  expect(heading.y - (shots.y + shots.height)).toBeGreaterThanOrEqual(80)
})
