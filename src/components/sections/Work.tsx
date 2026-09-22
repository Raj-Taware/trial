import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "../../lib/gsap"
import { useReducedMotion } from "../../lib/useReducedMotion"
import { CountUp } from "../text/CountUp"
import { projects, type Project } from "../../content/site"

/**
 * Act II. The work passes horizontally while the section is pinned — a dolly
 * shot rather than a grid of cards.
 *
 * Each panel owns the page while it is centred: entering one bleeds its accent
 * into a site-wide CSS variable, so the chrome, rules and hover states all
 * shift colour together. That shared tint is what makes four separate projects
 * read as one sequence.
 */
export function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth

      const dolly = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Scroll distance equals travel distance, so the horizontal motion
          // tracks the wheel one-to-one and never feels rubbery.
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 1,
        },
      })

      // containerAnimation lets these triggers fire off horizontal position
      // inside the pinned track rather than off document scroll.
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: dolly,
          start: "left center",
          end: "right center",
          onToggle: (self) => {
            if (!self.isActive) return
            const accent = panel.dataset.accent === "ion" ? "var(--color-ion)" : "var(--color-flare)"
            gsap.to(document.documentElement, { "--bleed": accent, duration: 0.6 } as gsap.TweenVars)
          },
        })

        // Content lags the panel slightly — parallax within the dolly, which is
        // what stops the row from reading as one flat sliding strip.
        gsap.from(panel.querySelector("[data-panel-body]"), {
          xPercent: 12,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: dolly,
            start: "left right",
            end: "left center",
            scrub: true,
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  if (reduced) {
    return (
      <section id="work" className="mx-auto max-w-5xl space-y-24 px-6 py-32">
        <h2 className="text-label">Selected Work</h2>
        {projects.map((project) => (
          <ProjectPanel key={project.id} project={project} />
        ))}
      </section>
    )
  }

  return (
    <section id="work" ref={sectionRef} className="relative h-svh overflow-hidden">
      <h2 className="text-label absolute top-8 left-6 z-20 md:left-10">Selected Work</h2>

      <div ref={trackRef} className="flex h-full w-max items-center will-change-transform">
        {projects.map((project) => (
          <div
            key={project.id}
            data-panel
            data-accent={project.accent}
            className="flex h-full w-[85vw] shrink-0 items-center px-6 md:w-[62vw] md:px-14"
          >
            <ProjectPanel project={project} />
          </div>
        ))}

        {/* A closing panel stops the last project from sitting against the edge. */}
        <div className="grid h-full w-[40vw] shrink-0 place-items-center px-14">
          <p className="text-display text-[clamp(1.5rem,3vw,2.5rem)] text-ink-300">
            More on request.
          </p>
        </div>
      </div>
    </section>
  )
}

function ProjectPanel({ project }: { project: Project }) {
  return (
    <article data-panel-body className="w-full">
      <div className="mb-6 flex items-baseline gap-4">
        <span className="text-label">{project.index}</span>
        <span className="h-px flex-1 bg-ink-700" />
        <span className="text-label">{project.year}</span>
      </div>

      <a
        href={project.href}
        data-cursor="view"
        className="group block"
      >
        <h3 className="text-display text-[clamp(2.25rem,6vw,5rem)] transition-colors duration-500 group-hover:text-[var(--bleed,var(--color-flare))]">
          {project.title}
        </h3>
      </a>

      <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink-300 md:text-lg">
        {project.summary}
      </p>

      <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-6">
        <div>
          <CountUp
            value={project.metric.value}
            suffix={project.metric.suffix}
            className="text-display block text-[clamp(2rem,4vw,3.25rem)] text-[var(--bleed,var(--color-flare))] tabular-nums"
          />
          <span className="text-label mt-2 block">{project.metric.label}</span>
        </div>

        <div>
          <span className="text-label mb-2 block">Role</span>
          <span className="text-sm text-ink-100">{project.role}</span>
        </div>

        <ul className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-ink-700 px-3 py-1 font-mono text-[0.7rem] text-ink-300"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
