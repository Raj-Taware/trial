import { useEffect, useRef } from "react"
import { gsap } from "../lib/gsap"
import { useReducedMotion } from "../lib/useReducedMotion"

/**
 * Two-part cursor: a dot that tracks exactly and a ring that trails behind it.
 * The lag between them is the whole effect — it gives the pointer mass.
 *
 * Only mounts on devices with a fine pointer, and only when motion is welcome.
 * Anything marked [data-cursor="..."] swells the ring and prints its label.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.body.style.cursor = "none"

    // Until the pointer moves we have no position for it, and drawing it at
    // the origin leaves a stray ring in the top-left corner on first paint.
    gsap.set([dot, ring], { opacity: 0, xPercent: 0, yPercent: 0 })
    let seen = false

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" })
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" })

    const onMove = (e: PointerEvent) => {
      if (!seen) {
        seen = true
        // Jump to the first known position, then fade in — no slide from 0,0.
        gsap.set(dot, { x: e.clientX, y: e.clientY })
        gsap.set(ring, { x: e.clientX, y: e.clientY })
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]")
      const text = target?.dataset.cursor ?? ""

      gsap.to(ring, {
        scale: target ? 2.6 : 1,
        borderColor: target ? "var(--color-flare)" : "var(--color-ink-500)",
        duration: 0.4,
        ease: "expo.out",
      })
      if (seen) gsap.to(dot, { opacity: target ? 0 : 1, duration: 0.2 })
      label.textContent = text
      gsap.to(label, { opacity: text ? 1 : 0, duration: 0.25 })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver, { passive: true })

    return () => {
      document.body.style.cursor = ""
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={dotRef}
        className="absolute -top-[3px] -left-[3px] size-1.5 rounded-full bg-flare"
      />
      <div
        ref={ringRef}
        className="absolute -top-5 -left-5 grid size-10 place-items-center rounded-full border border-ink-500"
      >
        <span
          ref={labelRef}
          className="font-mono text-[0.3rem] tracking-[0.18em] text-ink-100 uppercase opacity-0"
        />
      </div>
    </div>
  )
}
