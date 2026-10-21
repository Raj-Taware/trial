import { SplitReveal } from "../text/SplitReveal"
import { trajectory, headings } from "../../content/site"

/**
 * The timeline metaphor made literal: roles and study as a single descending
 * rule, most recent first.
 *
 * Deliberately the quietest section on the page. By this point the visitor has
 * seen the work; this is the part they scan rather than experience, so it gets
 * a plain reading layout and no scroll choreography beyond the line reveal.
 */
export function Trajectory() {
  return (
    <section id="trajectory" className="relative pt-4 pb-28 md:pt-10 md:pb-40">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-label mb-14">{headings.trajectory}</h2>

        <ol className="border-t border-ink-700">
          {trajectory.map((role) => (
            <li
              key={`${role.org}-${role.title}`}
              className="group grid gap-x-10 gap-y-3 border-b border-ink-700 py-8 md:grid-cols-[14rem_1fr] md:py-10"
            >
              <div>
                <span className="text-label block transition-colors duration-500 group-hover:text-flare">
                  {role.period}
                </span>
                <span className="text-label mt-1 block">{role.place}</span>
              </div>

              <div>
                <SplitReveal
                  as="h3"
                  className="text-display text-[clamp(1.25rem,2.6vw,1.9rem)]"
                  stagger={0.05}
                >
                  {role.title}
                </SplitReveal>
                <p className="mt-1 font-mono text-sm text-ink-100">{role.org}</p>
                <p className="mt-4 max-w-[60ch] leading-relaxed text-ink-300">{role.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
