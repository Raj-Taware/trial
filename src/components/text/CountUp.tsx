import { useEffect, useRef } from "react"
import { gsap, EASE } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"

/** Counts a number up when it scrolls into view. Numbers are the only part of
 *  a portfolio a reader actually checks, so they get their own beat.
 *
 *  Supports decimals because not every figure is a whole number: an AUROC of
 *  1.00 and an R² of 0.975 have to render as themselves, not as percentages
 *  they are not. */
export function CountUp({
  value,
  suffix = "",
  decimals = 0,
  className = "",
}: {
  value: number
  suffix?: string
  decimals?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  const format = (n: number) =>
    `${decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US")}${suffix}`

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const counter = { n: 0 }
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.6,
      ease: EASE.out,
      onUpdate: () => {
        el.textContent = format(counter.n)
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      // Leave the true value behind if we unmount mid-count.
      el.textContent = format(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, suffix, decimals, reduced])

  // Final value is in the DOM from the start — correct for assistive tech and
  // for anyone who never triggers the tween.
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}
