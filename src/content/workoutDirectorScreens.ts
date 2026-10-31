/**
 * Workout Director App Store screens (set v6, app build 1.0.89), for iPhone
 * 6.9 inch and iPad 13 inch. The web copies in public/assets/img/wd are made
 * from the App Store PNGs by `pnpm wd-screens <folder>` (scripts/wd-screens.ts).
 */
export type Device = 'iphone' | 'ipad'

/** Size of the App Store PNGs, which is also the aspect ratio of every web copy. */
export const deviceSize: Record<Device, { width: number; height: number }> = {
  iphone: { width: 1320, height: 2868 },
  ipad: { width: 2064, height: 2752 },
}

/** Widths the web copies are exported at, each as AVIF and WebP. */
export const screenWidths: Record<Device, readonly [number, number]> = {
  iphone: [400, 800],
  ipad: [640, 1280],
}

export interface Screen {
  /** File stem of the App Store PNG, such as `01-rep-counting`. */
  id: string
  /** Short name, shown under the screen in the gallery. */
  label: string
  /** What the screen shows, used as alt text. The headline on the screen comes first. */
  alt: string
}

const allScreens = {
  '01-rep-counting': {
    id: '01-rep-counting',
    label: 'Rep counting',
    alt: 'Every rep, counted for you. A goblet squat set on camera, with the count at 2 of 10, set 1 of 4, at 16 kg.',
  },
  '02-voice': {
    id: '02-voice',
    label: 'Voice',
    alt: 'Hands busy? Just say it. Spoken requests such as "Add a set" over a bench press set at 2 of 6.',
  },
  '03-live-coach': {
    id: '03-live-coach',
    label: 'Live Coach',
    alt: 'A coach in your corner. The voice coach tells you to brace your core before push-ups, with the count at 7 of 12.',
  },
  '04-manual': {
    id: '04-manual',
    label: 'Manual count',
    alt: 'No camera? Tap in your reps. A panel for entering 8 reps with minus and plus buttons, over a barbell exercise figure.',
  },
  '05-form': {
    id: '05-form',
    label: 'Form',
    alt: 'Know the form before you lift. The goblet squat page with an exercise figure and four numbered form steps.',
  },
  '06-trainer': {
    id: '06-trainer',
    label: 'Trainer',
    alt: 'Ask your trainer anything. A trainer chat that suggests box squats after a message about a tight knee.',
  },
  '07-progress': {
    id: '07-progress',
    label: 'Progress',
    alt: 'Steady progress, set by set. A workout summary with sets, reps and weight lifted, and a goblet squat chart rising to 21 kg.',
  },
  '08-today': {
    id: '08-today',
    label: 'Today',
    alt: "Today's workout, ready when you are. A 14 minute full body plan for the day with a Start workout button.",
  },
} satisfies Record<string, Screen>

export type ScreenId = keyof typeof allScreens

/**
 * The screens shown on the site, in App Store order. 02-voice is left out for
 * now; to show it, add '02-voice' after '01-rep-counting' and run `pnpm wd-screens`.
 */
export const shownScreenIds: ScreenId[] = [
  '01-rep-counting',
  '03-live-coach',
  '04-manual',
  '05-form',
  '06-trainer',
  '07-progress',
  '08-today',
]

export const screens: Screen[] = shownScreenIds.map((id) => allScreens[id])

export function screen(id: ScreenId): Screen {
  if (!shownScreenIds.includes(id)) throw new Error(`Screen ${id} is not in shownScreenIds`)
  return allScreens[id]
}

/** Path of one web copy, such as /assets/img/wd/iphone/01-rep-counting-800.avif. */
export function screenPath(id: string, device: Device, width: number, format: 'avif' | 'webp'): string {
  return `/assets/img/wd/${device}/${id}-${width}.${format}`
}

export function screenSrcSet(id: string, device: Device, format: 'avif' | 'webp'): string {
  return screenWidths[device].map((width) => `${screenPath(id, device, width, format)} ${width}w`).join(', ')
}

/** An iPad screen with two iPhone screens in front of it (see DeviceStage). */
export interface StageSpec {
  ipad: ScreenId
  phones: [ScreenId, ScreenId]
}

/** `sizes` for the screens on a stage, which is as wide as the page content (at most 1040px). */
export const stageSizes: Record<Device, string> = {
  ipad: '(max-width: 560px) 62vw, (max-width: 1100px) 42vw, 440px',
  iphone: '(max-width: 560px) 40vw, (max-width: 1100px) 21vw, 230px',
}

/**
 * A preload link for the iPad screen of a stage at the top of a page. It is the
 * largest image there, and the browser would otherwise find the AVIF copy only
 * once it reaches the <picture>.
 */
export function stagePreload(stage: StageSpec) {
  return {
    rel: 'preload',
    as: 'image',
    type: 'image/avif',
    imageSrcSet: screenSrcSet(stage.ipad, 'ipad', 'avif'),
    imageSizes: stageSizes.ipad,
    fetchPriority: 'high',
  } as const
}
