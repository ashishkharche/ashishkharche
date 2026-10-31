import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'
import { Logo } from './Logo'
import { Scramble } from './Scramble'
import { DeviceStage } from './Screens'
import { screenshotSrc, screenshotSrcSet, type ProjectCard as Card } from '~/content/projects'
import { breakpoints, colors, fonts } from '~/styles/tokens.stylex'

interface Props {
  card: Card
  headingLevel?: 'h2' | 'h3'
  /** For a project at the top of the page: load its images straight away, without the scroll fade. */
  priority?: boolean
}

/**
 * A project shown as its screenshots, large on the page, with the title and
 * summary underneath: either three phone screens in a row or, for a project
 * with a stage, an iPad and two iPhones layered on a soft panel. A project
 * with neither shows only its title and summary. Projects after the first get
 * a thin rule above.
 */
export function ProjectCard({ card, headingLevel = 'h3', priority = false }: Props) {
  const Heading = headingLevel
  const linkProps = stylex.props(styles.link)
  const label = (
    <>
      <Scramble>{card.title}</Scramble>{' '}
      <span aria-hidden="true" {...stylex.props(styles.arrow)}>
        {card.external ? '↗' : '→'}
      </span>
    </>
  )
  return (
    <article {...stylex.props(stylex.defaultMarker(), styles.project)}>
      {card.stage ? (
        <DeviceStage ipad={card.stage.ipad} phones={card.stage.phones} priority={priority} />
      ) : card.shots?.length ? (
        <div {...stylex.props(styles.media)}>
          {(card.shots ?? []).map((shot, index) => (
            <img
              key={shot.name}
              src={screenshotSrc(shot.name)}
              srcSet={screenshotSrcSet(shot.name)}
              sizes="(max-width: 760px) 30vw, 290px"
              width={480}
              height={1038}
              alt={shot.alt}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority && index === 1 ? 'high' : 'auto'}
              decoding="async"
              {...stylex.props(styles.phone)}
            />
          ))}
        </div>
      ) : null}
      <div {...stylex.props(styles.body, !card.stage && !card.shots?.length && styles.bodyOnly)}>
        <div {...stylex.props(styles.head)}>
          <Logo name={card.logo} size={40} />
          <div>
            <Heading {...stylex.props(styles.title)}>
              {card.external ? (
                <a href={card.href} {...linkProps}>
                  {label}
                </a>
              ) : (
                <Link to={card.href} {...linkProps}>
                  {label}
                </Link>
              )}
            </Heading>
            <p {...stylex.props(styles.meta)}>{card.meta}</p>
          </div>
        </div>
        <p {...stylex.props(styles.text)}>{card.summary}</p>
      </div>
    </article>
  )
}

const styles = stylex.create({
  project: {
    position: 'relative',
    paddingTop: { default: '4.5rem', ':first-child': 0, [breakpoints.tablet]: '3rem' },
    borderTopWidth: { default: '1px', ':first-child': 0 },
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
  },
  media: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  phone: {
    display: 'block',
    flex: 'none',
    width: { default: '30%', [breakpoints.tablet]: '31.5%' },
    borderRadius: { default: '22px', [breakpoints.tablet]: '12px' },
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: colors.phoneEdge,
    outlineOffset: '-1px',
  },
  body: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr 1.4fr', [breakpoints.tablet]: '1fr' },
    columnGap: '3rem',
    rowGap: '0.6rem',
    alignItems: 'baseline',
    marginTop: { default: '2.5rem', [breakpoints.tablet]: '1.75rem' },
  },
  // A project shown without screens: just the title and summary under the rule.
  bodyOnly: { marginTop: 0 },
  head: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
  title: {
    fontFamily: fonts.serif,
    fontSize: 'clamp(1.7rem, 3.4vw, 2.2rem)',
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: '-0.01em',
  },
  link: {
    color: { default: colors.text, [stylex.when.ancestor(':hover')]: colors.accent },
    textDecorationLine: { default: 'none', ':focus-visible': 'underline' },
    textUnderlineOffset: '0.2em',
    outline: 'none',
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
    },
  },
  // Geist Serif has no diagonal arrow, so the arrows use the body font.
  arrow: { display: 'inline-block', fontFamily: fonts.sans, fontSize: '0.8em' },
  meta: { marginTop: '0.4rem', fontSize: '0.95rem', color: colors.muted },
  text: { fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)', lineHeight: 1.55, color: colors.muted, maxWidth: '34em' },
})
