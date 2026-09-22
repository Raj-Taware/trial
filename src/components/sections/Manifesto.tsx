import { useEffect, useRef } from "react"
import { gsap, EASE } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"
import { manifesto } from "../../content/site"

/**
 * Act I → II bridge. The section pins and the scroll wheel becomes a scrubber:
 * one phrase at a time, each handing off to the next.
 *
 * This is the moment that teaches the visitor the site's grammar — that
 * scrolling here moves through something rather than down a page.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const phrases = gsap.utils.toArray<HTMLElement>("[data-phrase]")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // One viewport of scroll per phrase, so the pacing stays readable
          // however many phrases the copy ends up having.
          end: () => `+=${phrases.length * 55}%`,
          pin: true,
          scrub: 0.8,
          // Pinned sections must refresh before the progress rail's triggers,
          // which measure positions the pin spacers would otherwise invalidate.
          refreshPriority: 1,
        },
      })

      phrases.forEach((phrase, i) => {
        tl.fromTo(
          phrase,
          { yPercent: 60, opacity: 0, filter: "blur(12px)" },
          { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: EASE.soft },
        )
        // Every phrase leaves except the last, which holds as the section unpins.
        if (i < phrases.length - 1) {
          tl.to(phrase, {
            yPercent: -60,
            opacity: 0,
            filter: "blur(12px)",
            duration: 1,
            ease: "power2.in",
          })
        }
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  // Reduced motion gets the same words as a plain readable stack.
  if (reduced) {
    return (
      <section id="manifesto" className="mx-auto max-w-4xl space-y-8 px-6 py-32">
        {manifesto.map((phrase) => (
          <p key={phrase} className="text-display text-[clamp(1.75rem,4vw,3rem)]">
            {phrase}
          </p>
        ))}
      </section>
    )
  }

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative grid h-svh place-items-center overflow-hidden px-6"
    >
      <div className="relative w-full max-w-4xl">
        {manifesto.map((phrase, i) => (
          <p
            key={phrase}
            data-phrase
            className={`text-display text-center text-[clamp(1.75rem,5vw,3.75rem)] ${
              i === 0 ? "relative" : "absolute inset-0 grid place-items-center"
            }`}
          >
            {phrase}
          </p>
        ))}
      </div>
    </section>
  )
}
