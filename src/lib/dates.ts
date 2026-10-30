const LONG = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const SHORT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

function parseIsoDate(iso: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error(`Expected a YYYY-MM-DD date, got "${iso}"`)
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date "${iso}"`)
  return date
}

/** `2026-10-30` -> `30 October 2026` */
export function formatLongDate(iso: string): string {
  return LONG.format(parseIsoDate(iso))
}

/** `2026-10-30` -> `30 Oct 2026` */
export function formatShortDate(iso: string): string {
  // Intl gives "30 Sept 2026" for September in en-GB; the site uses three-letter months.
  return SHORT.format(parseIsoDate(iso)).replace('Sept', 'Sep')
}
