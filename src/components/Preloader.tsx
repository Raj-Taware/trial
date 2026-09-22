import { useEffect, useRef, useState } from "react"
import { gsap, EASE } from "../lib/gsap"

/**
 * A short hold before the first reveal. Its real job is to let webfonts and the
 * WebGL context settle so the hero's first frame is the finished one — a
 * loading screen that outlasts its reason is just a toll booth, so this one is
 * capped at roughly a second and a half.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const counter = { n: 0 }
    const tl = gsap.timeline()

    tl.to(counter, {
      n: 100,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.n)),
    })
      .to(rootRef.current, {
        yPercent: -100,
        duration: 1,
        ease: EASE.out,
        onStart: onDone,
      })
      .set(rootRef.current, { display: "none" })

    return () => {
      tl.kill()
    }
  }, [onDone])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] flex items-end justify-between bg-ink-900 p-8"
    >
      <span className="text-label">Loading assets</span>
      <span className="text-display text-[clamp(4rem,14vw,11rem)] tabular-nums">
        {String(count).padStart(3, "0")}
      </span>
    </div>
  )
}
