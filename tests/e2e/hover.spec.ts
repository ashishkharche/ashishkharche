import { expect, test } from '@playwright/test'

// Hovering a link may change its colour or underline, but never its letters.
for (const path of ['/', '/notes/', '/projects/']) {
  test(`${path}: link text does not change on hover`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover needs a pointer')
    await page.goto(path)
    const links = page.locator('header a, main a, footer a')
    const count = Math.min(await links.count(), 12)
    expect(count).toBeGreaterThan(3)
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      if (!(await link.isVisible())) continue
      const before = await link.innerText()
      await link.hover()
      const seen = new Set<string>()
      for (let step = 0; step < 6; step++) {
        seen.add(await link.innerText())
        await page.waitForTimeout(50)
      }
      expect([...seen], `link ${i} on ${path}`).toEqual([before])
      // No hidden layer of letters drawn over the real text (icons and arrows are fine).
      const hiddenLetters = await link.evaluate((el) =>
        [...el.querySelectorAll('[aria-hidden="true"]')].some((node) => /[A-Za-z]{2}/.test(node.textContent ?? '')),
      )
      expect(hiddenLetters, `link ${i} on ${path}`).toBe(false)
    }
  })
}
