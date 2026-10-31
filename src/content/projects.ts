import type { LogoName } from './logos'
import { links } from './site'
import type { StageSpec } from './workoutDirectorScreens'

export interface Screenshot {
  name: string
  alt: string
}

/** Path of a Kalo screenshot at a given width. They are exported at 480 and 960 pixels wide. */
export function screenshotSrc(name: string, width: 480 | 960 = 480): string {
  return `/assets/img/${name}-${width}.webp`
}

export function screenshotSrcSet(name: string): string {
  return `${screenshotSrc(name, 480)} 480w, ${screenshotSrc(name, 960)} 960w`
}

export interface ProjectCard {
  title: string
  href: string
  external: boolean
  summary: string
  meta: string
  logo: LogoName
  /** Three phone screenshots in a row. */
  shots?: Screenshot[]
  /** Or an iPad and two iPhone screens, layered. */
  stage?: StageSpec
}

export const workoutDirectorCard: ProjectCard = {
  title: 'Workout Director',
  href: '/projects/workout-director/',
  external: false,
  summary:
    'An iPhone and iPad training app that counts reps with the front camera, on the device, while a voice coach talks you through the workout.',
  meta: 'SwiftUI · TypeScript on AWS Lambda · Case study',
  logo: 'workoutDirector',
  stage: { ipad: '05-form', phones: ['03-live-coach', '08-today'] },
}

/** The screens at the top of the case study. */
export const workoutDirectorHero: StageSpec = { ipad: '01-rep-counting', phones: ['03-live-coach', '07-progress'] }

export const kaloCard: ProjectCard = {
  title: 'Kalo',
  href: links.kaloStore,
  external: true,
  summary:
    'A macro and calorie tracker for iPhone with photo, voice and barcode logging, HealthKit, widgets and a share extension.',
  meta: 'SwiftUI · App Store',
  logo: 'kalo',
  shots: [
    { name: 'kalo-2-photo', alt: 'Kalo showing macros for a photographed meal' },
    { name: 'kalo-3-camera', alt: 'Kalo pointing the camera at a plate of pasta' },
    { name: 'kalo-5-meals', alt: 'Kalo listing the day’s logged meals' },
  ],
}

export const projectCards = [workoutDirectorCard, kaloCard]
