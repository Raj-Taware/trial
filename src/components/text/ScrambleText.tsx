import { useEffect, useRef } from "react"
import { gsap } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"

/**
 * Character-scramble resolve, in the spirit of react-bits' "decrypt" effect but
 * driven by GSAP's ScrambleTextPlugin — which is now free, and handles the
 * width-jitter problem the hand-rolled versions all have.
 *
 * Reserved for short mono labels. On a sentence it becomes noise.
 */
export function ScrambleText({
  text,
  className = "",
  delay = 0,
  trigger = true,
}: {
  text: string
  className?: string
  delay?: number
  /** Flip to true to run the effect; lets a parent time it to a scroll beat. */
  trigger?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !trigger) return

    const tween = gsap.to(el, {
      duration: 1.2,
      delay,
      scrambleText: { text, chars: "01▚▓▒░/\\<>", speed: 0.5, revealDelay: 0.2 },
    })

    return () => {
      tween.kill()
      // Leave the real text behind if we unmount mid-scramble.
      el.textContent = text
    }
  }, [text, delay, reduced, trigger])

  // Rendered up front so the text is correct for screen readers, crawlers and
  // the reduced-motion path regardless of whether the tween ever runs.
  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
