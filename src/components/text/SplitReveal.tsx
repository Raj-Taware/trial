import { useEffect, useRef, type ElementType, type ReactNode } from "react"
import { gsap, SplitText, ScrollTrigger, EASE } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Stagger between lines, in seconds. */
  stagger?: number
  delay?: number
  /** Animate on mount instead of waiting for the element to scroll into view. */
  immediate?: boolean
}

/**
 * Line-by-line mask reveal — the workhorse of the whole site.
 *
 * Lines slide up from behind a clipped box rather than fading in, which reads
 * as a physical object moving rather than a DOM node appearing.
 */
export function SplitReveal({
  children,
  as: Tag = "div",
  className = "",
  stagger = 0.08,
  delay = 0,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let split: SplitText | null = null
    let ctx: gsap.Context | null = null
    let cancelled = false

    // Splitting before webfonts land measures the fallback face and produces
    // line breaks that jump the moment the real font swaps in.
    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return

      ctx = gsap.context(() => {
        split = new SplitText(el, { type: "lines", mask: "lines" })

        gsap.from(split.lines, {
          yPercent: 115,
          duration: 1.1,
          ease: EASE.out,
          stagger,
          delay,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start: "top 85%", once: true },
        })
      }, el)

      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      split?.revert()
      ctx?.revert()
    }
  }, [reduced, stagger, delay, immediate])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
