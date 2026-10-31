export interface NoteFrontmatter {
  title: string
  date: string
  series: string
  part: number
  listLabel: string
  description: string
}

export interface Note extends NoteFrontmatter {
  slug: string
  path: string
}

/** Checks a note's frontmatter and fills in its slug and path. */
export function toNote(file: string, frontmatter: Record<string, unknown>): Note {
  const slug = file
    .split('/')
    .pop()
    ?.replace(/\.mdx$/, '')
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new Error(`Bad note file name: ${file}`)
  const required = ['title', 'date', 'series', 'listLabel', 'description'] as const
  for (const key of required) {
    if (typeof frontmatter[key] !== 'string' || frontmatter[key] === '') {
      throw new Error(`Note ${slug} is missing "${key}" in its frontmatter`)
    }
  }
  if (typeof frontmatter.part !== 'number') throw new Error(`Note ${slug} is missing "part"`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date as string)) {
    throw new Error(`Note ${slug} has a date that is not YYYY-MM-DD`)
  }
  return { ...(frontmatter as unknown as NoteFrontmatter), slug, path: `/notes/${slug}/` }
}

/** Newest first; notes on the same day are ordered by series part. */
export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.date.localeCompare(a.date) || a.part - b.part)
}

// Only the frontmatter is imported here, so listing pages do not pull in note bodies.
const frontmatters = import.meta.glob<Record<string, unknown>>('../../content/notes/*.mdx', {
  eager: true,
  query: '?frontmatter',
  import: 'default',
})

export const notes: Note[] = sortNotes(
  Object.entries(frontmatters).map(([file, frontmatter]) => toNote(file, frontmatter)),
)

/** The first sentence of a note's description, for one-line lists. */
export function noteSummary(note: Pick<Note, 'description'>): string {
  const end = note.description.search(/[.!?](\s|$)/)
  return end === -1 ? note.description : note.description.slice(0, end + 1)
}

export function getNote(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug)
}

/** Parts of the Workout Director series that are planned but not written yet. */
export const comingNotes = [
  'Testing counting changes before they ship',
  'A voice coach that asks before it acts',
  'A small TypeScript backend on AWS Lambda',
  'Shipping without breaking old phones',
  "What I'd do differently",
]
