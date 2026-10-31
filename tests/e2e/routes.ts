import { sitemapPaths } from '../../src/content/site'

export const routes = [...sitemapPaths]

export const headings: Record<(typeof routes)[number], string> = {
  '/': "Hi, I'm Ashish.",
  '/work/': 'Work',
  '/projects/': 'Projects',
  '/projects/workout-director/': 'Workout Director',
  '/notes/': 'Notes',
  '/notes/workout-director-1/': 'Counting reps without the video leaving the phone',
  '/notes/workout-director-2/': 'Drawing exercise figures from code',
  '/notes/workout-director-3/': 'Choosing a pose model for the phone',
  '/notes/workout-director-4/': "Most of a rep counter is the reps it doesn't count",
  '/notes/workout-director-5/': 'Counting out loud, one line per rep',
  '/notes/workout-director-6/': 'A workout summary that only says what the camera saw',
  '/about/': 'About',
}
