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
    // Chapter boundaries, as document scroll positions.
    let bounds: { id: string; top: number }[] = []

    const measure = () => {
      bounds = chapters.map((chapter) => {
        const el = document.getElementById(chapter.id)
        if (!el) return { id: chapter.id, top: Number.POSITIVE_INFINITY }

        // A pinned section keeps its own height while consuming far more
        // scroll than that: the extra distance lives in the .pin-spacer
        // ScrollTrigger wraps it in. Measuring the element alone leaves gaps
        // between chapters where no chapter is active at all.
        const box = (el.closest(".pin-spacer") as HTMLElement | null) ?? el
        return { id: chapter.id, top: box.getBoundingClientRect().top + window.scrollY }
      })
    }

    // One trigger spanning the page, rather than one per chapter. Chapters are
    // resolved by comparing scroll against the boundaries above, so coverage
    // is contiguous and a jump straight into the middle of the page resolves
    // correctly instead of leaving the rail on whatever it last saw.
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      // Refresh after every pinned section has claimed its scroll distance,
      // so the boundaries we measure are the final ones.
      refreshPriority: -1,
      onRefresh: measure,
      onUpdate: (self) => {
        setProgress(self.progress)

        const probe = window.scrollY + window.innerHeight * 0.5
        let current = bounds[0]?.id ?? chapters[0].id
        for (const bound of bounds) {
          if (probe >= bound.top) current = bound.id
        }
        setActive(current)
      },
    })

    measure()

    return () => st.kill()
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
