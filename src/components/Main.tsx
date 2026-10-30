import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { breakpoints } from '~/styles/tokens.stylex'

export function Main({ children }: { children: ReactNode }) {
  return (
    <main id="main" {...stylex.props(styles.main)}>
      {children}
    </main>
  )
}

const styles = stylex.create({
  main: {
    paddingTop: { default: '4rem', [breakpoints.phone]: '2.5rem' },
    paddingBottom: '2rem',
  },
})
