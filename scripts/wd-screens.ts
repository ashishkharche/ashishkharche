// Makes the web copies of the Workout Director App Store screens: AVIF and
// WebP at the widths in src/content/workoutDirectorScreens.ts, for the screens
// listed there. Reads the PNGs from <folder>/iphone69 and <folder>/ipad13 and
// never changes them. Old copies of screens no longer listed are removed,
// except the iPhone copies of the extra screens, which are not made from the set.
// Usage: pnpm wd-screens <folder with iphone69/ and ipad13/>
import { mkdir, readdir, rm } from 'node:fs/promises'
import { basename, join } from 'node:path'
import sharp from 'sharp'
import {
  deviceSize,
  extraScreenIds,
  screenPath,
  screenWidths,
  shownScreenIds,
  type Device,
} from '../src/content/workoutDirectorScreens.ts'

const source = process.argv[2] ?? process.env.WD_SCREENS_DIR
if (!source) throw new Error('Pass the folder that holds iphone69/ and ipad13/')

const publicDir = new URL('../public', import.meta.url).pathname
const folders: Record<Device, string> = { iphone: 'iphone69', ipad: 'ipad13' }

for (const device of ['iphone', 'ipad'] as const) {
  const outDir = join(publicDir, 'assets/img/wd', device)
  await mkdir(outDir, { recursive: true })
  const keep = new Set<string>()
  if (device === 'iphone')
    for (const id of extraScreenIds)
      for (const width of screenWidths.iphone)
        for (const format of ['avif', 'webp'] as const) keep.add(basename(screenPath(id, device, width, format)))
  for (const id of shownScreenIds) {
    const input = join(source, folders[device], `${id}.png`)
    const meta = await sharp(input).metadata()
    const expected = deviceSize[device]
    if (meta.width !== expected.width || meta.height !== expected.height)
      throw new Error(`${input} is ${meta.width}x${meta.height}, expected ${expected.width}x${expected.height}`)
    for (const width of screenWidths[device]) {
      const resized = sharp(input).resize({ width, kernel: 'lanczos3' })
      const avif = screenPath(id, device, width, 'avif')
      const webp = screenPath(id, device, width, 'webp')
      await resized.clone().avif({ quality: 55, effort: 6 }).toFile(join(publicDir, avif))
      await resized.clone().webp({ quality: 80, effort: 6 }).toFile(join(publicDir, webp))
      keep.add(basename(avif)).add(basename(webp))
    }
  }
  for (const file of await readdir(outDir)) if (!keep.has(file)) await rm(join(outDir, file))
  console.log(`${device}: ${keep.size} files`)
}
