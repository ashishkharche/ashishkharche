import { ogImages } from '~/content/ogImages'
import * as stylex from '@stylexjs/stylex'
import { createFileRoute } from '@tanstack/react-router'
import { Main } from '~/components/Main'
import { PageHead } from '~/components/PageHead'
import { ProjectCard } from '~/components/ProjectCard'
import { kaloCard, workoutDirectorCard } from '~/content/projects'
import { seo } from '~/lib/seo'
import { breakpoints } from '~/styles/tokens.stylex'
import { ui } from '~/styles/ui'

export const Route = createFileRoute('/projects/')({
  head: () =>
    seo({
      path: '/projects/',
      title: 'Projects',
      description: 'Projects by Ashish Kharche: Workout Director and Kalo.',
      image: ogImages.projects,
    }),
  component: Projects,
})

function Projects() {
  return (
    <Main>
      <div {...stylex.props(ui.wrap)}>
        <PageHead title="Projects" lead="Apps I built outside work." />
        <div {...stylex.props(styles.grid, ui.section)}>
          <ProjectCard card={workoutDirectorCard} headingLevel="h2" priority />
          <ProjectCard card={kaloCard} headingLevel="h2" />
        </div>
        <p {...stylex.props(ui.note)}>Workout Director and Kalo are published on the App Store by Shelgaon Ltd.</p>
      </div>
    </Main>
  )
}

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: { default: '4.5rem', [breakpoints.tablet]: '3rem' },
  },
})
