import { useEffect, useState } from "react"
import { ScrollTrigger } from "../lib/gsap"
import { chapters } from "../content/site"
import { scrollToSection } from "../lib/useSmoothScroll"

/**
 * The persistent chapter rail. It does double duty: a read-progress indicator
 * and the site's only navigation — which is the point of treating the page as
 * one continuous timeline rather than a stack of sections.
 */
export function ProgressRail() {
  const [active, setActive] = useState<string>(chapters[0].id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const triggers = chapters.map((chapter) =>
      ScrollTrigger.create({
        trigger: `#${chapter.id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(chapter.id),
        // Negative priority: refresh after every pinned section has claimed
        // its scroll distance, so these positions are the final ones.
        refreshPriority: -1,
      }),
    )

    const overall = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setProgress(self.progress),
    })

    return () => {
      triggers.forEach((t) => t.kill())
      overall.kill()
    }
  }, [])

  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 lg:block"
    >
      <div className="flex flex-col items-end gap-5">
        {chapters.map((chapter) => {
          const isActive = active === chapter.id
          return (
            <button
              key={chapter.id}
              onClick={() => scrollToSection(chapter.id)}
              aria-current={isActive ? "true" : undefined}
              data-cursor="go"
              className="group flex items-center gap-3"
            >
              <span
                className={`text-label transition-all duration-500 ${
                  isActive
                    ? "translate-x-0 text-ink-100 opacity-100"
                    : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                }`}
              >
                {chapter.label}
              </span>
              <span
                className={`block h-px transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  isActive ? "w-10 bg-flare" : "w-4 bg-ink-500 group-hover:w-7"
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Overall progress, as a hairline under the chapter list. */}
      <div className="mt-8 ml-auto h-24 w-px bg-ink-700">
        <div
          className="w-px origin-top bg-flare"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </nav>
  )
}
