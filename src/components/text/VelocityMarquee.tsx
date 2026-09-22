import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"

/**
 * A marquee whose speed and direction are driven by scroll velocity — the
 * react-bits "scroll velocity" idea, rebuilt on ScrollTrigger so it shares the
 * page's single Lenis-driven clock instead of running its own rAF loop.
 */
export function VelocityMarquee({
  words,
  baseSpeed = 0.6,
  className = "",
}: {
  words: string[]
  /** Idle drift in px per frame, before scroll velocity is added. */
  baseSpeed?: number
  className?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const track = trackRef.current
    if (!track || reduced) return

    let offset = 0
    let velocity = 0
    let direction = 1

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        direction = self.direction
        // Scroll velocity is in px/sec and gets large; damp it hard.
        velocity = Math.min(Math.abs(self.getVelocity()) / 220, 14)
      },
    })

    // The track holds two identical copies; wrapping at -50% of its width makes
    // the loop seamless without measuring individual words.
    const tick = () => {
      const width = track.scrollWidth / 2
      if (!width) return
      offset -= (baseSpeed + velocity) * direction
      offset = ((offset % width) + width) % width
      gsap.set(track, { x: -offset })
      // Velocity decays so the marquee settles back to its idle drift.
      velocity *= 0.94
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      trigger.kill()
    }
  }, [baseSpeed, reduced])

  const sequence = [...words, ...words]

  return (
    <div className={`relative overflow-hidden py-6 ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex w-max gap-10 whitespace-nowrap will-change-transform">
        {sequence.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="text-display text-[clamp(2.5rem,7vw,6rem)] text-ink-500 select-none"
          >
            {word}
            <span className="text-flare"> / </span>
          </span>
        ))}
      </div>
    </div>
  )
}
