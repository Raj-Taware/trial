import { useCallback, useEffect, useState } from "react"
import { ScrollTrigger } from "./lib/gsap"
import { useSmoothScroll } from "./lib/useSmoothScroll"
import { useReducedMotion } from "./lib/useReducedMotion"
import { Preloader } from "./components/Preloader"
import { Cursor } from "./components/Cursor"
import { ProgressRail } from "./components/ProgressRail"
import { Hero } from "./components/sections/Hero"
import { Manifesto } from "./components/sections/Manifesto"
import { Work } from "./components/sections/Work"
import { Capabilities } from "./components/sections/Capabilities"
import { Contact } from "./components/sections/Contact"

export default function App() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(reduced)

  // Lenis is skipped entirely under reduced motion — the smoothing itself is
  // motion the visitor did not ask for.
  useSmoothScroll(!reduced)

  const onPreloadDone = useCallback(() => setReady(true), [])

  useEffect(() => {
    // Pinned sections measure themselves on mount, before webfonts have
    // settled; one refresh afterwards keeps every trigger honest.
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      {!reduced && <Preloader onDone={onPreloadDone} />}
      <Cursor />
      <ProgressRail />

      <a
        href="#contact"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-ink-100 focus:px-4 focus:py-2 focus:text-ink-900"
      >
        Skip to contact details
      </a>

      <main>
        <Hero ready={ready} />
        <Manifesto />
        <Work />
        <Capabilities />
        <Contact />
      </main>
    </>
  )
}
