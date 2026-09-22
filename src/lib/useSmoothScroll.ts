import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "./gsap"

/**
 * Lenis drives the scroll position; GSAP's ticker drives Lenis; ScrollTrigger
 * updates off Lenis. One clock for everything — mixing rAF loops is the usual
 * cause of scroll-linked animation jitter.
 *
 * Lenis runs on native scroll, so anchors, sticky positioning and the browser's
 * own find-on-page all keep working.
 */
let instance: Lenis | null = null

/** Lets chrome components (nav, progress rail) drive the same scroll engine. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (instance) instance.scrollTo(target, { offset: 0, duration: 1.4 })
  else target.scrollIntoView({ behavior: "smooth" })
}

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.1,
      // Long, decelerating curve — the scroll should feel weighted.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      autoRaf: false,
    })

    instance = lenis
    lenis.on("scroll", ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    // Lag smoothing makes GSAP skip time after a stall, which desyncs Lenis.
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      instance = null
    }
  }, [enabled])
}
