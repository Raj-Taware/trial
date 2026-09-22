import { Suspense, lazy, useEffect, useRef } from "react"
import { gsap } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"

// three.js is ~186 KB gzipped — deferring it lets the headline paint first.
// The radial gradient baked into ShaderField's host stands in until it lands.
const ShaderField = lazy(() =>
  import("../webgl/ShaderField").then((m) => ({ default: m.ShaderField })),
)
import { SplitReveal } from "../text/SplitReveal"
import { ScrambleText } from "../text/ScrambleText"
import { identity } from "../../content/site"

/**
 * Act I. One declarative line over a generative field.
 *
 * No hero image, no buttons above the fold, no "scroll to explore" button that
 * does what scrolling already does. The claim has to carry the screen alone.
 */
export function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // The hero recedes as you leave it — content drifts up and dims while the
      // shader drains, so the next act starts from near-black.
      gsap.to(contentRef.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="film-grain relative flex h-svh min-h-[600px] w-full flex-col justify-between overflow-hidden p-6 md:p-10"
    >
      <Suspense fallback={null}>
        <ShaderField still={reduced} />
      </Suspense>
      {/* Legibility scrim: the field's bright folds are unpredictable, so the
          headline gets a guaranteed floor of contrast rather than a hope. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,6,8,0.85)_0%,rgba(6,6,8,0.45)_45%,rgba(6,6,8,0.15)_100%)]"
      />

      <header className="relative z-10 flex items-start justify-between">
        <span className="text-label">{identity.name}</span>
        <span className="text-label hidden sm:block">{identity.location}</span>
      </header>

      <div ref={contentRef} className="relative z-10 max-w-5xl">
        {ready && (
          <ScrambleText
            text={identity.role}
            className="text-label mb-6 block"
            delay={0.2}
          />
        )}

        <SplitReveal
          as="h1"
          immediate={ready}
          delay={0.35}
          stagger={0.1}
          className="text-display text-[clamp(2.75rem,8vw,7.5rem)]"
        >
          {identity.thesis}
        </SplitReveal>
      </div>

      <footer className="relative z-10 flex items-end justify-between gap-6">
        <span className="text-label max-w-[22ch]">{identity.availability}</span>
        {/* The hint is a hairline, not a bouncing chevron. */}
        <div className="flex items-center gap-3">
          <span className="text-label">Scroll</span>
          <span className="block h-px w-16 origin-left animate-pulse bg-ink-500" />
        </div>
      </footer>
    </section>
  )
}
