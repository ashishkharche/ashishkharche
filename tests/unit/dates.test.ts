import { describe, expect, it } from 'vitest'
import { formatLongDate, formatShortDate } from '~/lib/dates'

describe('dates', () => {
  it('formats long dates in British English', () => {
    expect(formatLongDate('2026-10-30')).toBe('30 October 2026')
  })
  it('formats short dates with three-letter months', () => {
    expect(formatShortDate('2026-10-30')).toBe('30 Oct 2026')
    expect(formatShortDate('2026-09-01')).toBe('1 Sep 2026')
  })
  it('rejects anything that is not YYYY-MM-DD', () => {
    expect(() => formatLongDate('30/10/2026')).toThrow()
    expect(() => formatShortDate('2026-13-45')).toThrow()
  })
})
