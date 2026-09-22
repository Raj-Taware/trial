import { Suspense, lazy, useRef, type PointerEvent as ReactPointerEvent } from "react"
import { gsap } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"

const VantaLayer = lazy(() =>
  import("../webgl/VantaLayer").then((m) => ({ default: m.VantaLayer })),
)
import { SplitReveal } from "../text/SplitReveal"
import { identity, socials } from "../../content/site"

/**
 * Act III. Everything quiets down.
 *
 * After two acts of motion the payoff is restraint: one address, three links,
 * and a field so dim it reads as depth rather than decoration. Quiet lands
 * harder when it follows noise — that contrast is the whole design.
 */
export function Contact() {
  const reduced = useReducedMotion()

  return (
    <section
      id="contact"
      className="film-grain relative flex min-h-svh flex-col justify-between overflow-hidden p-6 md:p-10"
    >
      {!reduced && (
        <Suspense fallback={null}>
          <VantaLayer className="opacity-40" />
        </Suspense>
      )}
      {/* Holds the type legible no matter what the field is doing behind it. */}
      <div aria-hidden="true" className="absolute inset-0 bg-ink-900/55" />

      <header className="relative z-10">
        <span className="text-label">Invitation</span>
      </header>

      <div className="relative z-10 py-20">
        <SplitReveal
          as="p"
          className="text-display mb-12 max-w-2xl text-[clamp(1.5rem,3vw,2.5rem)] text-ink-300"
        >
          If any of this is the kind of thing you need built, say so.
        </SplitReveal>

        <MagneticLink href={`mailto:${identity.email}`}>
          {identity.email}
        </MagneticLink>
      </div>

      <footer className="relative z-10 flex flex-wrap items-end justify-between gap-6">
        <ul className="flex gap-6">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                data-cursor="open"
                target="_blank"
                rel="noreferrer"
                className="text-label transition-colors duration-300 hover:text-ink-100"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="text-label">
          © {new Date().getFullYear()} {identity.name}
        </span>
      </footer>
    </section>
  )
}

/**
 * The link leans toward the cursor before you reach it. It is a small thing,
 * but it is the difference between a target and something that wants to be hit.
 */
function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    gsap.to(ref.current, {
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.18,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.3,
      duration: 0.7,
      ease: "power3.out",
    })
  }

  const onLeave = () => {
    if (reduced || !ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" })
  }

  return (
    <a
      ref={ref}
      href={href}
      data-cursor="write"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="text-display inline-block text-[clamp(2rem,7vw,6rem)] break-all transition-colors duration-500 hover:text-flare"
    >
      {children}
    </a>
  )
}
