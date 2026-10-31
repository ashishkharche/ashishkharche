import rehypeShiki from '@shikijs/rehype'
import type { RehypeShikiOptions } from '@shikijs/rehype'
import type { ShikiTransformer } from 'shiki'
import { createCssVariablesTheme } from 'shiki/core'

/** Languages used in the MDX content. Add one here before using it in a fenced block. */
export const codeLanguages = ['python', 'json', 'swift', 'typescript', 'tsx', 'shell'] as const

type Element = Parameters<NonNullable<ShikiTransformer['span']>>[0]

/**
 * Shiki theme whose colours are CSS variables. The colours themselves live in
 * src/styles/global.css, with light and dark values.
 */
const theme = createCssVariablesTheme({ name: 'site', variablePrefix: '--shiki-' })

function readStyle(node: Element): string {
  const style = node.properties.style
  delete node.properties.style
  return typeof style === 'string' ? style : ''
}

function addClass(node: Element, name: string): void {
  const current = node.properties.className
  const list = Array.isArray(current) ? current : []
  node.properties.className = [...list, name]
}

/**
 * The Content-Security-Policy allows no inline style attributes, so the styles
 * Shiki writes on each token become classes (tok-keyword, tok-string, ...).
 * The block gets the language as a data attribute for its label.
 */
const styleToClass: ShikiTransformer = {
  name: 'site:style-to-class',
  pre(node) {
    readStyle(node)
    node.properties.className = ['code']
    node.properties.dataLanguage = this.options.lang
  },
  code(node) {
    node.properties.dataLanguage = this.options.lang
  },
  span(node) {
    const style = readStyle(node)
    for (const declaration of style.split(';')) {
      const [property = '', value = ''] = declaration.split(':').map((part) => part.trim())
      if (!property) continue
      const variable = /^var\(--shiki-([a-z-]+)\)$/.exec(value)
      if (property === 'color' && variable?.[1]) {
        if (variable[1] !== 'foreground') addClass(node, `tok-${variable[1].replace(/^token-/, '')}`)
      } else if (property === 'font-style' && value === 'italic') addClass(node, 'tok-italic')
      else if (property === 'font-weight' && value === 'bold') addClass(node, 'tok-bold')
      else if (property === 'text-decoration' && value === 'underline') addClass(node, 'tok-underline')
      else throw new Error(`Unexpected code token style: ${declaration}`)
    }
  },
}

export const shikiOptions: RehypeShikiOptions = {
  theme,
  langs: [...codeLanguages],
  defaultLanguage: 'text',
  fallbackLanguage: 'text',
  transformers: [styleToClass],
}

export const rehypeHighlight = [rehypeShiki, shikiOptions] as const
