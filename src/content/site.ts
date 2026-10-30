export const site = {
  name: 'Ashish Kharche',
  url: 'https://ashishkharche.com',
  locale: 'en_GB',
  lang: 'en-GB',
  city: 'London',
  description:
    'Ashish Kharche, mobile engineer in London. Android and iOS apps, and the backend and AWS infrastructure behind them.',
  ogImage: '/assets/og.png',
  ogImageAlt: 'Ashish Kharche, with the AK mark.',
  email: 'thekharche@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ashish-kharche',
  github: 'https://github.com/ashishkharche',
} as const

export const links = {
  workoutDirectorStore: 'https://apps.apple.com/gb/app/workout-director-gym-home/id6813645709',
  workoutDirectorSite: 'https://workoutdirector.com',
  kaloStore: 'https://apps.apple.com/gb/app/kalo-ai-macro-tracker/id6752915724',
} as const

export const nav = [
  { to: '/work/', label: 'Work' },
  { to: '/projects/', label: 'Projects' },
  { to: '/notes/', label: 'Notes' },
  { to: '/about/', label: 'About' },
] as const

export type NavPath = (typeof nav)[number]['to']

/** Every page that should be in the sitemap. The 404 page is left out on purpose. */
export const sitemapPaths = [
  '/',
  '/work/',
  '/projects/',
  '/projects/workout-director/',
  '/notes/',
  '/notes/workout-director-1/',
  '/about/',
] as const
