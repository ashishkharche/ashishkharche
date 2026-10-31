import * as stylex from '@stylexjs/stylex'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Logo } from '~/components/Logo'
import { Main } from '~/components/Main'
import { PhoneRow } from '~/components/PhoneRow'
import { ProjectCard } from '~/components/ProjectCard'
import { Rows } from '~/components/Rows'
import { SectionHead } from '~/components/SectionHead'
import { kaloCard, workoutDirectorCard, type Screenshot } from '~/content/projects'
import { notes, noteSummary } from '~/content/notes'
import { site } from '~/content/site'
import { formatShortDate } from '~/lib/dates'
import { seo } from '~/lib/seo'
import { personJsonLd } from '~/lib/structuredData'
import { breakpoints, colors } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

const heroShots: [Screenshot, Screenshot, Screenshot] = [
  { name: 'kalo-2-photo', alt: '' },
  { name: 'wd-1-live-coach', alt: '' },
  { name: 'wd-6-progress', alt: '' },
]
const heroSizes = '(max-width: 760px) 31vw, 170px'

const homeSeo = seo({
  path: '/',
  fullTitle: 'Ashish Kharche · Software engineer in London',
  description: site.description,
  type: 'profile',
})

export const Route = createFileRoute('/')({
  head: () => ({
    meta: homeSeo.meta,
    // React preloads the hero's middle phone itself (it has fetchPriority="high").
    links: homeSeo.links,
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(personJsonLd) }],
  }),
  component: Home,
})

function Home() {
  const latestNotes = notes.slice(0, 3).map((note) => ({
    title: note.title,
    href: note.path,
    date: formatShortDate(note.date),
    desc: noteSummary(note),
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
              Paythru on payment apps for EV charging, and in 2026 I worked on its new payments platform on AWS. I've
              also done QA on the Grok iOS and web apps at <Logo name="spacexsi" size={20} inline />
              SpaceX Super Intelligence. I'm looking for a full-time role in the UK in mobile, full-stack, cloud or AI
              engineering.
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
          </div>
          <PhoneRow shots={heroShots} sizes={heroSizes} />
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
            <Rows rows={latestNotes} />
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
              . My CV is available on request.
            </p>
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
    gap: { default: '3rem', [breakpoints.tablet]: '2.5rem' },
  },
  intro: {},
  title: {
    fontSize: 'clamp(2.2rem, 5.4vw, 3.4rem)',
    lineHeight: 1.08,
    textWrap: 'balance',
    fontWeight: 600,
    letterSpacing: '-0.025em',
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
  selected: {},
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: { default: '4.5rem', [breakpoints.tablet]: '3rem' },
  },
  notes: { maxWidth: '780px' },
  contactTitle: { marginBottom: '0.75rem' },
})
