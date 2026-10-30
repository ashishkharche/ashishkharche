import * as stylex from '@stylexjs/stylex'
import { Link, createFileRoute } from '@tanstack/react-router'
import CaseStudy from '#content/projects/workout-director.mdx'
import { Diagram } from '~/components/Diagram'
import { Facts, Gallery, HeroMedia, Shots } from '~/components/Figures'
import { Logo } from '~/components/Logo'
import { Main } from '~/components/Main'
import { PageHead } from '~/components/PageHead'
import { Muted, Prose, mdxComponents } from '~/components/Prose'
import { workoutDirectorCard, workoutDirectorGallery } from '~/content/projects'
import { links } from '~/content/site'
import { seo } from '~/lib/seo'
import { colors } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

export const Route = createFileRoute('/projects/workout-director')({
  head: () =>
    seo({
      path: '/projects/workout-director/',
      title: 'Workout Director',
      description:
        'Case study: an iPhone training app that counts reps on the device and has a voice coach. SwiftUI app and a TypeScript backend on AWS Lambda.',
      type: 'article',
    }),
  component: WorkoutDirector,
})

function ScreensGallery() {
  return (
    <div {...stylex.props(ui.wide, styles.gallery)}>
      <Gallery shots={workoutDirectorGallery} label="Workout Director App Store screenshots" />
    </div>
  )
}

function WorkoutDirector() {
  return (
    <Main>
      <div {...stylex.props(ui.wrap)}>
        <Link to="/projects/" {...stylex.props(styles.back, ui.focusRing)}>
          ← Projects
        </Link>
        <PageHead
          title="Workout Director"
          lead={workoutDirectorCard.summary}
          icon={<Logo name="workoutDirector" size={40} />}
        />
        <HeroMedia shots={workoutDirectorCard.shots} />
      </div>
      <div {...stylex.props(ui.column)}>
        <Facts
          items={[
            { term: 'My part', detail: 'SwiftUI app, TypeScript backend, releases' },
            { term: 'Stack', detail: 'SwiftUI, SwiftData, MediaPipe, WebRTC, AWS Lambda, DynamoDB, AWS CDK' },
            { term: 'Published by', detail: 'Shelgaon Ltd' },
            {
              term: 'Links',
              detail: (
                <>
                  <a href={links.workoutDirectorStore} {...stylex.props(ui.link)}>
                    App Store
                  </a>{' '}
                  ·{' '}
                  <a href={links.workoutDirectorSite} {...stylex.props(ui.link)}>
                    Website
                  </a>
                </>
              ),
            },
          ]}
        />
        <div {...stylex.props(ui.section)}>
          <Prose>
            <CaseStudy components={{ ...mdxComponents, Diagram, Shots, Muted, Gallery: ScreensGallery }} />
          </Prose>
        </div>
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
  gallery: { marginTop: '1.25rem', marginBottom: '2rem' },
})
