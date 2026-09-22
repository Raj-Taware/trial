import { useEffect, useRef } from "react"
import { gsap, EASE } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"

/** Counts a number up when it scrolls into view. Numbers are the only part of
 *  a portfolio a reader actually checks, so they get their own beat. */
export function CountUp({
  value,
  suffix = "",
  className = "",
}: {
  value: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const counter = { n: 0 }
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.6,
      ease: EASE.out,
      onUpdate: () => {
        el.textContent = `${Math.round(counter.n)}${suffix}`
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value, suffix, reduced])

  // Final value is in the DOM from the start — correct for assistive tech and
  // for anyone who never triggers the tween.
  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
