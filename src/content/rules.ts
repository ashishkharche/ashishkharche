import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/**
 * Words and details that must not appear anywhere on the site. Checked by
 * the unit tests (source) and by the post-build step (built HTML).
 */
export const bannedPatterns: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /openai/i, reason: 'model providers are not named' },
  { pattern: /stripe/i, reason: 'not used' },
  { pattern: /\b20\s?%/, reason: 'no percentage claims' },
  { pattern: /part[- ]time/i, reason: 'roles are not described as part-time' },
  { pattern: /\+44|\b07\d{3}\s?\d{6}\b/, reason: 'no phone numbers' },
  { pattern: /date of birth|\bDOB\b/i, reason: 'no date of birth' },
]

/**
 * Extra terms kept in a local file outside the repo, one case-insensitive
 * regular expression per line. Blank lines and lines starting with # are
 * ignored. Set BLOCKED_TERMS_FILE to use a different path.
 */
export const localTermsFile =
  process.env.BLOCKED_TERMS_FILE ?? join(homedir(), '.config', 'ashishkharche', 'blocked-terms.txt')

export function loadLocalTerms(file = localTermsFile): RegExp[] | undefined {
  if (!existsSync(file)) return undefined
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => new RegExp(line, 'i'))
}

const localTerms = loadLocalTerms()

/** xAI is only allowed in the "(formerly xAI)" note about SpaceXSI. */
export function hasStrayXai(text: string): boolean {
  return /\bxAI\b/.test(text.replaceAll('formerly xAI', ''))
}

export function findBanned(text: string, terms: RegExp[] = localTerms ?? []): string[] {
  const hits = bannedPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ reason, pattern }) => `${pattern}: ${reason}`)
  for (const [index, term] of terms.entries()) {
    if (term.test(text)) hits.push(`matches line ${index + 1} of the local terms list`)
  }
  if (hasStrayXai(text)) hits.push('xAI named outside "(formerly xAI)"')
  return hits
}
