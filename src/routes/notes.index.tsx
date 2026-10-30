import * as stylex from '@stylexjs/stylex'
import { createFileRoute } from '@tanstack/react-router'
import { Main } from '~/components/Main'
import { PageHead } from '~/components/PageHead'
import { Rows, type Row } from '~/components/Rows'
import { comingNotes, notes } from '~/content/notes'
import { formatShortDate } from '~/lib/dates'
import { seo } from '~/lib/seo'
import { ui } from '~/styles/ui'

export const Route = createFileRoute('/notes/')({
  head: () =>
    seo({
      path: '/notes/',
      title: 'Notes',
      description: 'Technical notes by Ashish Kharche, starting with a series on how Workout Director is built.',
    }),
  component: Notes,
})

function Notes() {
  const rows: Row[] = [
    ...notes.map((note) => ({
      title: note.title,
      href: note.path,
      date: formatShortDate(note.date),
      desc: note.listLabel,
    })),
    ...comingNotes.map((title, index) => ({
      title,
      date: 'Coming',
      desc: `Workout Director, part ${notes.length + index + 1}`,
    })),
  ]
  return (
    <Main>
      <div {...stylex.props(ui.column)}>
        <PageHead title="Notes" lead="Technical notes on things I've built." />
        <section aria-labelledby="series-title" {...stylex.props(ui.section)}>
          <h2 id="series-title" {...stylex.props(ui.h2)}>
            How Workout Director is built
          </h2>
          <p {...stylex.props(ui.muted, styles.sub)}>A series on the iPhone app and its backend.</p>
          <Rows rows={rows} />
        </section>
      </div>
    </Main>
  )
}

const styles = stylex.create({
  sub: { marginTop: '0.3rem', marginBottom: '1rem' },
})
