import { useRef, type PointerEvent as ReactPointerEvent } from "react"
import { gsap } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"
import { SplitReveal } from "../text/SplitReveal"
import { VelocityMarquee } from "../text/VelocityMarquee"
import { capabilities, marqueeWords } from "../../content/site"

/**
 * Act II coda. Tilt-and-glare cards, in the react-bits spirit but rebuilt so
 * the tilt is driven by GSAP quickTo — the usual implementation writes inline
 * transforms on every pointermove and drops frames on a busy page.
 */
export function Capabilities() {
  const reduced = useReducedMotion()

  return (
    <section id="capabilities" className="relative py-28 md:py-40">
      <VelocityMarquee words={marqueeWords} className="mb-24 border-y border-ink-700" />

      <div className="mx-auto max-w-6xl px-6">
        <SplitReveal
          as="h2"
          className="text-display mb-16 max-w-3xl text-[clamp(1.75rem,4vw,3.25rem)]"
        >
          What I actually do when the motion stops.
        </SplitReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {capabilities.map((capability, i) => (
            <TiltCard key={capability.title} disabled={reduced}>
              <span className="text-label">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-display mt-6 text-[clamp(1.35rem,2.5vw,2rem)]">
                {capability.title}
              </h3>
              <p className="mt-4 max-w-[40ch] leading-relaxed text-ink-300">
                {capability.body}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function TiltCard({
  children,
  disabled,
}: {
  children: React.ReactNode
  disabled: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const setters = useRef<{
    rx: gsap.QuickToFunc
    ry: gsap.QuickToFunc
    gx: gsap.QuickToFunc
    gy: gsap.QuickToFunc
  } | null>(null)

  const ensureSetters = () => {
    if (setters.current || !cardRef.current || !glareRef.current) return
    setters.current = {
      rx: gsap.quickTo(cardRef.current, "rotateX", { duration: 0.6, ease: "power3" }),
      ry: gsap.quickTo(cardRef.current, "rotateY", { duration: 0.6, ease: "power3" }),
      gx: gsap.quickTo(glareRef.current, "xPercent", { duration: 0.6, ease: "power3" }),
      gy: gsap.quickTo(glareRef.current, "yPercent", { duration: 0.6, ease: "power3" }),
    }
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return
    ensureSetters()
    const card = cardRef.current
    if (!card || !setters.current) return

    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    // Kept under 7° — past that the text distorts and the card reads as a toy.
    setters.current.ry(gsap.utils.mapRange(0, 1, -6.5, 6.5, px))
    setters.current.rx(gsap.utils.mapRange(0, 1, 6.5, -6.5, py))
    setters.current.gx(gsap.utils.mapRange(0, 1, -40, 40, px))
    setters.current.gy(gsap.utils.mapRange(0, 1, -40, 40, py))
  }

  const onLeave = () => {
    if (disabled || !setters.current) return
    setters.current.rx(0)
    setters.current.ry(0)
  }

  return (
    <div
      className="h-full [perspective:1200px]"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div
        ref={cardRef}
        data-cursor="tilt"
        className="relative h-full overflow-hidden rounded-2xl border border-ink-700 bg-ink-800/60 p-8 backdrop-blur-sm transition-colors duration-500 hover:border-[var(--bleed,var(--color-flare))] md:p-10 [transform-style:preserve-3d]"
      >
        {/* Specular sweep that follows the pointer — the cue that sells the tilt. */}
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1/2 bg-[radial-gradient(circle_at_center,var(--color-flare)_0%,transparent_55%)] opacity-[0.07]"
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}
