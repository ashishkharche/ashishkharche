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

// A few key items from the full list on the case study, in the order they appear there.
const heroPicks = new Set(['SwiftUI', 'MediaPipe BlazePose', 'AWS Lambda', 'DynamoDB'])
const heroStack = workoutDirectorStack.filter((item) => heroPicks.has(item))

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
            <p {...stylex.props(styles.kicker)}>
              <span aria-hidden="true" {...stylex.props(styles.slash)} />
              Software engineer · {site.city}
            </p>
            <h1 id="intro-title" {...stylex.props(styles.title)}>
              Hi, I'm{' '}
              <span {...stylex.props(styles.name)}>
                Ashish
                <Sweep />
              </span>
              .
            </h1>
            <p {...stylex.props(styles.lead)}>I work on Android and iOS apps, and the AWS backend behind them.</p>
            <ul role="list" aria-label="Roles" {...stylex.props(styles.roles)}>
              <li {...stylex.props(styles.role)}>
                <Logo name="paythru" size={22} />
                <span>
                  <span {...stylex.props(styles.roleHead)}>
                    <span {...stylex.props(styles.roleName)}>Paythru</span>
                    <span {...stylex.props(styles.years)}>2022 to 2026</span>
                  </span>
                  <span {...stylex.props(styles.roleText)}>
                    Payment apps for EV charging, then its new payments platform on AWS.
                  </span>
                </span>
              </li>
              <li {...stylex.props(styles.role)}>
                <Logo name="spacexsi" size={22} />
                <span>
                  <span {...stylex.props(styles.roleHead)}>
                    <span {...stylex.props(styles.roleName)}>SpaceX Super Intelligence</span>
                  </span>
                  <span {...stylex.props(styles.roleText)}>Part-time QA.</span>
                </span>
              </li>
            </ul>
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
          <div {...stylex.props(styles.phones)}>
            <PhoneRow shots={heroShots} sizes={heroSizes} label="Workout Director app screens" />
          </div>
          <div aria-labelledby="wd-title" role="group" {...stylex.props(styles.app)}>
            <div {...stylex.props(styles.groundRow)}>
              <Ground />
              <svg viewBox="100 154 504 380" aria-hidden="true" focusable="false" {...stylex.props(styles.groundMark)}>
                <path d={akOutline} />
              </svg>
            </div>
            <div {...stylex.props(styles.appHead)}>
              <Logo name="workoutDirector" size={40} />
              <p>
                <span id="wd-title" {...stylex.props(styles.appName)}>
                  Workout Director
                </span>
                <span {...stylex.props(styles.appKind)}>iPhone and iPad app</span>
              </p>
            </div>
            <p {...stylex.props(styles.appLinks)}>
              {workoutDirectorLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...stylex.props(styles.button, index === 0 && styles.primary, ui.focusRing)}
                >
                  {link.label}
                  <span aria-hidden="true" {...stylex.props(styles.arrow)}>
                    ↗
                  </span>
                </a>
              ))}
              <Link to="/projects/workout-director/" {...stylex.props(styles.button, ui.focusRing)}>
                Case study
                <span aria-hidden="true" {...stylex.props(styles.arrow)}>
                  →
                </span>
              </Link>
            </p>
            <div {...stylex.props(styles.stack)}>
              <span id="wd-stack" {...stylex.props(styles.stackLabel)}>
                Built with
              </span>
              <ul role="list" aria-labelledby="wd-stack" {...stylex.props(styles.tags)}>
                {heroStack.map((item) => (
                  <li key={item} {...stylex.props(styles.tag)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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

/**
 * A hand-drawn stroke under the name, in the same thin line as the footer art
 * and the section hills. It draws itself in once, unless motion is reduced.
 */
function Sweep() {
  return (
    <svg
      viewBox="0 0 300 30"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      {...stylex.props(styles.sweep)}
    >
      <path pathLength={1} d="M6 19C52 12 104 9 156 12s96 8 138-6" {...stylex.props(styles.sweepLine)} />
      <path pathLength={1} d="M40 26c46-6 98-7 146-4s72 1 98-6" {...stylex.props(styles.sweepLine, styles.sweepEcho)} />
    </svg>
  )
}

/**
 * The ground line from the footer, with the soft hills over it fading at both
 * ends. The app screens stand on it, like the figures in the footer drawing.
 */
function Ground() {
  return (
    <svg
      viewBox="0 0 520 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      {...stylex.props(styles.ground)}
    >
      <defs>
        <linearGradient id="hero-ground-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.15" stopColor="currentColor" />
          <stop offset="0.85" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#hero-ground-fade)" strokeLinecap="round" vectorEffect="non-scaling-stroke">
        <path d="M0 30h520" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <path
          d="M0 30C70 30 110 16 170 15s110 11 160 10 80-13 130-14 50 8 60 10"
          strokeWidth="1.3"
          strokeOpacity="0.55"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 30c60 0 100-8 150-9s100 8 150 7 90-12 140-12 60 9 80 11"
          strokeWidth="1.1"
          strokeOpacity="0.3"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}

// The outline AK mark from the footer drawing (public/assets/img/footer-identity.svg).
const akOutline =
  'M397.8 170.2l3.3-6.2h-95.5L110 524h95.5l108.3-199.2V524h84V372.6l15.3-16.4 82 167.8h93.3L474.6 290.6 593.4 164H478.2l-80.4 85.8Z'

const draw = stylex.keyframes({
  from: { strokeDashoffset: 1 },
  to: { strokeDashoffset: 0 },
})

const styles = stylex.create({
  hero: {
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr) minmax(0, 1fr)', [breakpoints.tablet]: 'minmax(0, 1fr)' },
    alignItems: 'center',
    columnGap: '4rem',
    rowGap: { default: '0.25rem', [breakpoints.tablet]: '2.5rem' },
  },
  intro: {
    gridColumnStart: 1,
    gridRowStart: 1,
    gridRowEnd: { default: 'span 2', [breakpoints.tablet]: 'span 1' },
  },
  // A small label over the name: the slanted bar is the stroke of the A in the AK mark.
  kicker: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontFamily: fonts.mono,
    fontSize: '0.78rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: colors.muted,
  },
  slash: {
    display: 'inline-block',
    width: '7px',
    height: '15px',
    backgroundColor: colors.text,
    transform: 'skewX(-28deg)',
  },
  title: {
    marginTop: '0.9rem',
    fontFamily: fonts.serif,
    fontSize: 'clamp(3rem, 7vw, 4.6rem)',
    lineHeight: 1.02,
    fontWeight: 400,
    letterSpacing: '-0.02em',
  },
  name: { position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' },
  sweep: {
    position: 'absolute',
    left: '-6%',
    width: '116%',
    bottom: '-0.34em',
    height: '0.4em',
    overflow: 'visible',
    color: colors.text,
    pointerEvents: 'none',
  },
  sweepLine: {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.6,
    strokeLinecap: 'round',
    vectorEffect: 'non-scaling-stroke',
    strokeDasharray: 1,
    strokeDashoffset: 0,
    animationName: { default: draw, [breakpoints.reducedMotion]: 'none' },
    animationDuration: '0.9s',
    animationDelay: '0.25s',
    animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
    animationFillMode: 'backwards',
  },
  sweepEcho: {
    strokeWidth: 1.4,
    opacity: 0.45,
    animationDelay: '0.55s',
  },
  lead: {
    marginTop: '1.6rem',
    fontSize: 'clamp(1.15rem, 2.2vw, 1.35rem)',
    lineHeight: 1.45,
    maxWidth: '24em',
    textWrap: 'pretty',
  },
  // Where Ashish has worked: two short rows between thin rules, like the footer's ground line.
  roles: {
    listStyle: 'none',
    marginTop: '1.75rem',
    maxWidth: '30rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
  },
  role: {
    display: 'grid',
    gridTemplateColumns: '28px minmax(0, 1fr)',
    columnGap: '0.85rem',
    alignItems: 'start',
    paddingBlock: '0.8rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  roleHead: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: '0.7rem' },
  roleName: { fontWeight: 500 },
  years: { fontFamily: fonts.mono, fontSize: '0.8rem', color: colors.muted },
  roleText: { display: 'block', marginTop: '0.1rem', fontSize: '0.95rem', lineHeight: 1.5, color: colors.muted },
  links: {
    marginTop: '1.4rem',
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '0.5rem',
    columnGap: '1.25rem',
    fontSize: '1rem',
  },
  phones: {
    gridColumnStart: { default: 2, [breakpoints.tablet]: 1 },
    gridRowStart: { default: 1, [breakpoints.tablet]: 3 },
    minWidth: 0,
    alignSelf: 'end',
  },
  // Workout Director, under its screens on wide screens and straight after the intro on phones.
  app: {
    gridColumnStart: { default: 2, [breakpoints.tablet]: 1 },
    gridRowStart: 2,
    alignSelf: 'start',
    minWidth: 0,
  },
  groundRow: { position: 'relative', marginTop: { default: '1rem', [breakpoints.tablet]: 0 } },
  // Stands on the ground line near its left end, as the AK does in the footer.
  groundMark: {
    position: 'absolute',
    left: '12%',
    bottom: '2px',
    height: '40px',
    width: '53px',
    fill: 'none',
    stroke: colors.muted,
    strokeWidth: 1.5,
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  },
  ground: { display: 'block', width: '100%', height: '32px', color: colors.muted, opacity: 0.7 },
  appHead: { marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' },
  appName: {
    display: 'block',
    fontFamily: fonts.serif,
    fontSize: '1.65rem',
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
  },
  appKind: { display: 'block', marginTop: '0.2rem', fontSize: '0.95rem', color: colors.muted },
  appLinks: { marginTop: '1.1rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    minHeight: '2.6rem',
    paddingInline: '1.05rem',
    borderRadius: '999px',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: colors.text,
    color: colors.text,
    backgroundColor: { default: 'transparent', ':hover': colors.soft },
    fontSize: '0.95rem',
    fontWeight: 500,
    textDecorationLine: 'none',
    transitionProperty: 'background-color, color',
    transitionDuration: '0.15s',
  },
  primary: {
    color: colors.bg,
    backgroundColor: { default: colors.text, ':hover': colors.muted },
  },
  arrow: { fontSize: '0.85em' },
  stack: {
    marginTop: '1.1rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    rowGap: '0.5rem',
    columnGap: '0.75rem',
  },
  stackLabel: {
    fontFamily: fonts.mono,
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: colors.muted,
  },
  tags: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
  tag: {
    fontFamily: fonts.mono,
    fontSize: '0.78rem',
    lineHeight: 1.4,
    paddingBlock: '0.2rem',
    paddingInline: '0.55rem',
    borderRadius: '6px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.diagramEdge,
    color: colors.text,
  },
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
