import * as stylex from '@stylexjs/stylex'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Availability } from '~/components/Availability'
import { Logo } from '~/components/Logo'
import { Main } from '~/components/Main'
import { NoteList } from '~/components/NoteList'
import { PhoneRow } from '~/components/PhoneRow'
import { ProjectCard } from '~/components/ProjectCard'
import { SectionHead } from '~/components/SectionHead'
import { kaloCard, workoutDirectorCard, workoutDirectorLinks, workoutDirectorStack } from '~/content/projects'
import type { ScreenId } from '~/content/workoutDirectorScreens'
import { noteListSummary, notes } from '~/content/notes'
import { site } from '~/content/site'
import { formatShortDate } from '~/lib/dates'
import { seo } from '~/lib/seo'
import { homeJsonLd, jsonLdScript } from '~/lib/structuredData'
import { breakpoints, colors, fonts } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

// All three from the dark Workout Director set, so the row never mixes light and dark screens.
const heroShots: [ScreenId, ScreenId, ScreenId] = ['02-voice', '06-trainer', '07-progress']
const heroSizes = '(max-width: 640px) min(62vw, 250px), (max-width: 760px) 31vw, 170px'

const homeSeo = seo({
  path: '/',
  fullTitle: 'Ashish Kharche · Software engineer in London',
  description: site.description,
  type: 'profile',
})

export const Route = createFileRoute('/')({
  head: () => ({
    meta: homeSeo.meta,
    // React preloads the hero's first phone itself (it has fetchPriority="high").
    links: homeSeo.links,
    scripts: [jsonLdScript(homeJsonLd)],
  }),
  component: Home,
})

function Home() {
  const latestNotes = notes.slice(0, 3).map((note) => ({
    title: note.title,
    href: note.path,
    meta: `${formatShortDate(note.date)} · ${note.listLabel}`,
    summary: noteListSummary(note),
  }))
  return (
    <Main>
      <div {...stylex.props(ui.wrap)}>
        <section aria-labelledby="intro-title" {...stylex.props(styles.hero)}>
          <div {...stylex.props(styles.intro)}>
            <h1 id="intro-title" {...stylex.props(styles.title)}>
              Hi, I'm Ashish.
            </h1>
            <p {...stylex.props(styles.lead)}>
              I'm a software engineer in London working on Android and iOS apps, and the backend and AWS infrastructure
              behind them.
            </p>
            <p {...stylex.props(styles.sub)}>
              From 2022 to 2026 I worked at <Logo name="paythru" size={20} inline />
              Paythru on payment apps for EV charging, and in 2026 I worked on its new payments platform on AWS. I also
              did part-time QA at <Logo name="spacexsi" size={20} inline />
              SpaceX Super Intelligence.
            </p>
            <p {...stylex.props(styles.links)}>
              <Link to="/work/" {...stylex.props(ui.link)}>
                Work history
              </Link>
              <a href={`mailto:${site.email}`} {...stylex.props(ui.link)}>
                Email
              </a>
              <a href={site.linkedin} {...stylex.props(ui.link)}>
                LinkedIn
              </a>
              <a href={site.github} {...stylex.props(ui.link)}>
                GitHub
              </a>
            </p>
            <div {...stylex.props(styles.app)}>
              <p {...stylex.props(styles.appTitle)}>
                <Logo name="workoutDirector" size={20} inline />
                <span>
                  <span {...stylex.props(styles.appName)}>Workout Director</span>, iPhone and iPad app
                </span>
              </p>
              <p {...stylex.props(styles.appLinks)}>
                {workoutDirectorLinks.map((link) => (
                  <a key={link.href} href={link.href} {...stylex.props(ui.link)}>
                    {link.label}
                    <span aria-hidden="true" {...stylex.props(styles.arrow)}>
                      {' '}
                      ↗
                    </span>
                  </a>
                ))}
                <Link to="/projects/workout-director/" {...stylex.props(ui.link)}>
                  Case study
                </Link>
              </p>
              <p {...stylex.props(styles.stack)}>
                <span {...stylex.props(styles.stackLabel)}>Built with </span>
                {workoutDirectorStack.join(' · ')}
              </p>
            </div>
          </div>
          <PhoneRow shots={heroShots} sizes={heroSizes} label="Workout Director app screens" />
        </section>

        <section aria-labelledby="sel-title" {...stylex.props(ui.section, styles.selected)}>
          <SectionHead id="sel-title" title="Selected work" to="/projects/" linkLabel="All projects" />
          <div {...stylex.props(styles.grid)}>
            <ProjectCard card={workoutDirectorCard} />
            <ProjectCard card={kaloCard} />
          </div>
        </section>

        <section aria-labelledby="notes-title" {...stylex.props(ui.section)}>
          <SectionHead id="notes-title" title="Notes" to="/notes/" linkLabel="All notes" />
          <div {...stylex.props(styles.notes)}>
            <NoteList items={latestNotes} />
          </div>
        </section>

        <div {...stylex.props(ui.narrow)}>
          <section aria-labelledby="contact-title" {...stylex.props(ui.section)}>
            <h2 id="contact-title" {...stylex.props(ui.h2, styles.contactTitle)}>
              Contact
            </h2>
            <p>
              Email me at{' '}
              <a href={`mailto:${site.email}`} {...stylex.props(ui.link)}>
                {site.email}
              </a>
              . I'm also on{' '}
              <a href={site.linkedin} {...stylex.props(ui.link)}>
                LinkedIn
              </a>{' '}
              and{' '}
              <a href={site.github} {...stylex.props(ui.link)}>
                GitHub
              </a>
              .
            </p>
            <Availability email={false} />
          </section>
        </div>
      </div>
    </Main>
  )
}

const styles = stylex.create({
  hero: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr 1fr', [breakpoints.tablet]: '1fr' },
    alignItems: 'center',
    gap: { default: '4rem', [breakpoints.tablet]: '3rem' },
  },
  intro: {},
  title: {
    fontFamily: fonts.serif,
    fontSize: 'clamp(2.5rem, 6vw, 3.9rem)',
    lineHeight: 1.05,
    textWrap: 'balance',
    fontWeight: 400,
    letterSpacing: '-0.015em',
  },
  lead: {
    marginTop: '1.1rem',
    fontSize: 'clamp(1.2rem, 2.4vw, 1.45rem)',
    lineHeight: 1.5,
    maxWidth: '34em',
  },
  sub: { marginTop: '1rem', color: colors.muted, maxWidth: '38em' },
  links: {
    marginTop: '1.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '0.5rem',
    columnGap: '1.25rem',
    fontSize: '1rem',
  },
  // Workout Director under the intro: a thin rule, the links, then the stack in the muted colour.
  app: {
    marginTop: '2rem',
    paddingTop: '1.25rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    maxWidth: '34em',
  },
  appTitle: { display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem' },
  appName: { fontWeight: 500 },
  appLinks: {
    marginTop: '0.75rem',
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '0.5rem',
    columnGap: '1.25rem',
    fontSize: '1rem',
  },
  arrow: { fontSize: '0.8em' },
  stack: { marginTop: '0.85rem', fontSize: '0.95rem', lineHeight: 1.6, color: colors.muted },
  stackLabel: { color: colors.text },
  // More room between the hero screens and the next heading.
  selected: { marginTop: { default: '7rem', [breakpoints.tablet]: '5.5rem', [breakpoints.phone]: '4.5rem' } },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: { default: '4.5rem', [breakpoints.tablet]: '3rem' },
  },
  notes: { maxWidth: '780px' },
  contactTitle: { marginBottom: '0.75rem' },
})
