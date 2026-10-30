import type { LogoName } from './logos'
import { links } from './site'

export interface Screenshot {
  name: string
  alt: string
}

/** Path of a screenshot at a given width. Screenshots are exported at 480 and 960 pixels wide. */
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
  shots: Screenshot[]
}

export const workoutDirectorCard: ProjectCard = {
  title: 'Workout Director',
  href: '/projects/workout-director/',
  external: false,
  summary:
    'An iPhone and iPad training app that counts reps with the front camera, on the device, while a voice coach talks you through the workout.',
  meta: 'SwiftUI · TypeScript on AWS Lambda · Case study',
  logo: 'workoutDirector',
  shots: [
    { name: 'wd-1-live-coach', alt: 'Live Coach counting goblet squats, 4 of 10' },
    { name: 'wd-4-today-plan', alt: "Today's workout, already planned" },
    { name: 'wd-7-trainer', alt: 'The trainer chat' },
  ],
}

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

export const workoutDirectorGallery: Screenshot[] = [
  { name: 'wd-1-live-coach', alt: 'Live Coach counting goblet squats, 4 of 10 at 16 kg' },
  { name: 'wd-2-get-ready', alt: 'The 3, 2, 1, Go countdown before a set' },
  { name: 'wd-3-timed-sets', alt: 'A timed hold showing the time left and a bar' },
  { name: 'wd-4-today-plan', alt: "Today's workout, already planned" },
  { name: 'wd-5-form-figures', alt: 'Exercise figures and form cues for a goblet squat' },
  { name: 'wd-6-progress', alt: 'History of sessions, sets, reps and weights' },
  { name: 'wd-7-trainer', alt: 'The trainer chat, which remembers earlier conversations' },
]
