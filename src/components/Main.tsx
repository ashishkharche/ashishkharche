import * as stylex from '@stylexjs/stylex'
import { useEffect, useRef, type ReactNode } from 'react'
import { breakpoints } from '~/styles/tokens.stylex'

/**
 * What fades in on scroll: sections without project cards in them, project
 * cards, and the children of anything marked data-reveal (the case study
 * text). Only the outermost match counts.
 */
const REVEAL = 'section:not(:has(article)), article, [data-reveal] > *'
const REVEAL_SIMPLE = 'article, [data-reveal] > *'

function revealTargets(main: HTMLElement): HTMLElement[] {
  let found: HTMLElement[]
  try {
    found = Array.from(main.querySelectorAll<HTMLElement>(REVEAL))
  } catch {
    found = Array.from(main.querySelectorAll<HTMLElement>(REVEAL_SIMPLE))
  }
  return found.filter((el) => !found.some((other) => other !== el && other.contains(el)))
}

/**
 * Sections below the fold rise in gently as they scroll into view. The page is
 * complete without JavaScript: content is only hidden after hydration, only
 * when it starts below the fold (so the hero and anything already on screen
 * are never hidden), and not at all when reduced motion is asked for. The
 * movement is a translate, which does not shift the layout.
 */
function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const main = ref.current
    if (!main || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const fold = window.innerHeight
    const targets = revealTargets(main).filter((el) => el.getBoundingClientRect().top > fold)
    if (targets.length === 0) return
    for (const el of targets) el.classList.add(...revealClasses.hidden)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer.unobserve(entry.target)
          entry.target.classList.add(...revealClasses.shown)
          entry.target.classList.remove(...revealClasses.hidden)
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    )
    for (const el of targets) observer.observe(el)
    return () => {
      observer.disconnect()
      for (const el of targets) el.classList.remove(...revealClasses.hidden, ...revealClasses.shown)
    }
  }, [ref])
}

export function Main({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <main id="main" ref={ref} {...stylex.props(styles.main)}>
      {children}
    </main>
  )
}

const styles = stylex.create({
  main: {
    paddingTop: { default: '4rem', [breakpoints.phone]: '2.5rem' },
    paddingBottom: '2rem',
  },
  hidden: { opacity: 0, translate: '0 18px' },
  shown: {
    transitionProperty: 'opacity, translate',
    transitionDuration: '0.6s',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
})

const classList = (className: string | undefined) => (className ?? '').split(' ').filter(Boolean)
const revealClasses = {
  hidden: classList(stylex.props(styles.hidden).className),
  shown: classList(stylex.props(styles.shown).className),
}
