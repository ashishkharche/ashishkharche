import * as stylex from '@stylexjs/stylex'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Diagram } from '~/components/Diagram'
import { Shots, ThemedFigures } from '~/components/Figures'
import { Main } from '~/components/Main'
import { Muted, Prose, mdxComponents } from '~/components/Prose'
import { getNoteBody } from '~/content/noteBodies'
import { getNote } from '~/content/notes'
import { formatLongDate } from '~/lib/dates'
import { seo } from '~/lib/seo'
import { colors } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

export const Route = createFileRoute('/notes/$slug')({
  loader: ({ params }) => {
    const note = getNote(params.slug)
    if (!note) throw notFound()
    return note
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({ path: loaderData.path, title: loaderData.title, description: loaderData.description, type: 'article' })
      : {},
  component: NotePage,
})

function NotePage() {
  const note = Route.useLoaderData()
  const Body = getNoteBody(note.slug)
  if (!Body) throw notFound()
  return (
    <Main>
      <div {...stylex.props(ui.column)}>
        <Link to="/notes/" {...stylex.props(styles.back, ui.focusRing)}>
          ← Notes
        </Link>
        <Prose as="article" aria-labelledby="post-title">
          <header>
            <p {...stylex.props(styles.meta)}>
              <time dateTime={note.date}>{formatLongDate(note.date)}</time> · {note.series}, part {note.part}
            </p>
            <h1 id="post-title" {...stylex.props(styles.title)}>
              {note.title}
            </h1>
          </header>
          <div {...stylex.props(styles.body)}>
            {/* Body comes from a module-level map of compiled MDX files; nothing is created here. */}
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Body components={{ ...mdxComponents, Diagram, Shots, ThemedFigures, Muted }} />
          </div>
        </Prose>
      </div>
    </Main>
  )
}

const styles = stylex.create({
  back: {
    display: 'inline-block',
    marginBottom: '1.75rem',
    fontSize: '1rem',
    color: { default: colors.muted, ':hover': colors.accent },
    textDecorationLine: 'none',
  },
  meta: { color: colors.muted, fontSize: '1rem' },
  title: {
    marginTop: '0.6rem',
    fontSize: 'clamp(1.9rem, 4.6vw, 2.5rem)',
    lineHeight: 1.15,
    textWrap: 'balance',
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  body: { marginTop: '2rem' },
})
