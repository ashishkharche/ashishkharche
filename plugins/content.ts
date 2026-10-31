import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { render } from 'pele'
import type { Plugin } from 'vite'
import { parse as parseYaml } from 'yaml'

export const TITLE_PLACEHOLDER = '__DIAGRAM_TITLE__'

export interface RenderedDiagram {
  id: string
  svg: string
  width: number
  height: number
}

/**
 * Renders a Mermaid source to a themed SVG string with Pele.
 *
 * The site's Content-Security-Policy does not allow inline style attributes,
 * so the root style that Pele writes is dropped (the same declarations live in
 * global.css under `.pele`) and the rounded-corner styles become rx attributes.
 * The SVG gets a <title> placeholder that the Diagram component fills in.
 */
export function renderDiagram(source: string, id: string): RenderedDiagram {
  const result = render(source, {
    idPrefix: `${id}-`,
    fontFamily: 'Geist, system-ui, sans-serif',
    fontSize: 16,
    padding: 8,
    maxWidth: 980,
  })
  let svg = result.svg
  svg = svg.replace(/^<svg([^>]*?) style="[^"]*"/, '<svg$1')
  svg = svg.replaceAll('style="rx:var(--_r)"', 'rx="6"')
  svg = svg
    .replace(/ role="[^"]*"/, ` role="img" aria-labelledby="${id}-title"`)
    .replace(/ aria-roledescription="[^"]*"/, '')
  svg = svg.replace(/^(<svg[^>]*>)/, `$1<title id="${id}-title">${TITLE_PLACEHOLDER}</title>`)
  if (/style=/.test(svg) || /<style/i.test(svg) || /<script/i.test(svg)) {
    throw new Error(`Diagram ${id} still has inline styles or scripts after cleanup`)
  }
  return { id, svg, width: result.width, height: result.height }
}

/** Lets source files import `.mmd` files and get the rendered SVG at build time. */
export function pele(): Plugin {
  return {
    name: 'site:pele',
    enforce: 'pre',
    async load(id) {
      const file = id.split('?')[0]
      if (!file?.endsWith('.mmd')) return null
      this.addWatchFile(file)
      const source = await readFile(file, 'utf8')
      const name = basename(file, '.mmd')
      const diagram = renderDiagram(source, `d${name.slice(0, 2)}`)
      return `export default ${JSON.stringify(diagram)}`
    },
  }
}

/** Reads the YAML frontmatter at the top of an MDX file. */
export function readFrontmatter(source: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  if (!match?.[1]) return {}
  const data: unknown = parseYaml(match[1])
  return data && typeof data === 'object' ? (data as Record<string, unknown>) : {}
}

/**
 * `import data from './note.mdx?frontmatter'` gives just the frontmatter, so
 * listing pages can show titles and dates without bundling the note itself.
 */
export function mdxFrontmatter(): Plugin {
  return {
    name: 'site:mdx-frontmatter',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!source.endsWith('.mdx?frontmatter')) return null
      const resolved = await this.resolve(source.replace(/\?frontmatter$/, ''), importer, { skipSelf: true })
      return resolved ? `\0frontmatter:${resolved.id}` : null
    },
    async load(id) {
      if (!id.startsWith('\0frontmatter:')) return null
      const file = id.slice('\0frontmatter:'.length)
      this.addWatchFile(file)
      return `export default ${JSON.stringify(readFrontmatter(await readFile(file, 'utf8')))}`
    },
  }
}
