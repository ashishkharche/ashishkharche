import * as stylex from '@stylexjs/stylex'
import { useEffect, useRef } from 'react'
import { colors } from '~/styles/tokens.stylex'

const DURATION_MS = 300
const STEP_MS = 40
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = LOWER.toUpperCase()

function randomLike(char: string): string {
  if (/[a-z]/.test(char)) return LOWER[Math.floor(Math.random() * LOWER.length)] ?? char
  if (/[A-Z]/.test(char)) return UPPER[Math.floor(Math.random() * UPPER.length)] ?? char
  return char
}

/**
 * Link text that scrambles for a moment and then settles, left to right, when
 * its link is hovered or focused from the keyboard. The real text never
 * changes and stays in place, so screen readers read the real word and nothing
 * moves; the scrambled letters are drawn over it in an aria-hidden layer.
 * Nothing happens when reduced motion is asked for, or when the text wraps
 * onto two lines.
 */
export function Scramble({ children }: { children: string }) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const layerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const text = textRef.current
    const layer = layerRef.current
    const trigger = root?.closest<HTMLElement>('a, button')
    if (!root || !text || !layer || !trigger) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      layer.textContent = ''
      text.className = classes.text
      layer.className = classes.layer
    }

    const start = () => {
      if (frame !== 0 || reduced.matches || root.getClientRects().length > 1) return
      const word = children
      const began = performance.now()
      let lastStep = -1
      text.className = classes.textHidden
      layer.className = classes.layerShown
      const tick = (now: number) => {
        const progress = Math.min(1, (now - began) / DURATION_MS)
        const step = Math.floor((now - began) / STEP_MS)
        if (step !== lastStep || progress === 1) {
          lastStep = step
          const settled = Math.floor(progress * word.length)
          let out = ''
          for (let i = 0; i < word.length; i++) {
            const char = word[i] ?? ''
            out += i < settled ? char : randomLike(char)
          }
          layer.textContent = out
        }
        if (progress < 1) frame = requestAnimationFrame(tick)
        else stop()
      }
      frame = requestAnimationFrame(tick)
    }

    const onFocus = () => {
      if (trigger.matches(':focus-visible')) start()
    }

    trigger.addEventListener('pointerenter', start)
    trigger.addEventListener('focus', onFocus)
    return () => {
      trigger.removeEventListener('pointerenter', start)
      trigger.removeEventListener('focus', onFocus)
      stop()
    }
  }, [children])

  return (
    <span ref={rootRef} {...stylex.props(styles.root)}>
      <span ref={textRef} {...stylex.props(styles.text)}>
        {children}
      </span>
      <span ref={layerRef} aria-hidden="true" {...stylex.props(styles.layer)} />
    </span>
  )
}

const styles = stylex.create({
  root: { position: 'relative' },
  text: {},
  // The real text keeps its space (and any underline from the link) but is not painted.
  textHidden: { color: 'transparent' },
  layer: {
    display: 'none',
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    whiteSpace: 'pre',
    pointerEvents: 'none',
    userSelect: 'none',
    color: colors.muted,
  },
  layerShown: { display: 'block' },
})

const classes = {
  text: stylex.props(styles.text).className ?? '',
  textHidden: stylex.props(styles.text, styles.textHidden).className ?? '',
  layer: stylex.props(styles.layer).className ?? '',
  layerShown: stylex.props(styles.layer, styles.layerShown).className ?? '',
}
