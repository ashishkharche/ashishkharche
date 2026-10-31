import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// Link text must stay still on hover: no letter-scramble effect, in any form.
const root = fileURLToPath(new URL('../../', import.meta.url))

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|css|mdx|mjs)$/.test(name) ? [path] : []
  })
}

const files = [...sourceFiles(join(root, 'src')), ...sourceFiles(join(root, 'content'))]

describe('no letter-scramble effect', () => {
  it('has no scramble component, hook or styles', () => {
    for (const file of files) {
      const name = relative(root, file)
      expect(name, name).not.toMatch(/scrambl/i)
      expect(readFileSync(file, 'utf8'), name).not.toMatch(/scrambl|glitch|typewriter/i)
    }
  })

  it('has no code that swaps text for random letters', () => {
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      const randomLetters = /Math\.random\(\)/.test(text) && /abcdefghijklmnopqrstuvwxyz/i.test(text)
      expect(randomLetters, relative(root, file)).toBe(false)
    }
  })
})
