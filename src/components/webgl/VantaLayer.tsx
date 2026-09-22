import { useEffect, useRef } from "react"
import * as THREE from "three"
import fogModule from "vanta/dist/vanta.fog.min"

type VantaEffect = { destroy: () => void }
type VantaFactory = (options: Record<string, unknown>) => VantaEffect

/**
 * Vanta publishes a UMD bundle. Depending on how the bundler applies CommonJS
 * interop, the callable arrives as the module itself, as `.default`, or as
 * `.default.default` — Vite gives us the last of those. Unwrap until we find
 * the function rather than assuming a shape.
 */
function resolveFactory(mod: unknown): VantaFactory | null {
  let candidate: unknown = mod
  for (let depth = 0; depth < 3; depth++) {
    if (typeof candidate === "function") return candidate as VantaFactory
    if (typeof candidate !== "object" || candidate === null) return null
    candidate = (candidate as { default?: unknown }).default
  }
  return null
}

/**
 * One deliberate use of Vanta, in the final act only.
 *
 * Vanta's presets are strong but instantly recognisable, so this is pushed far
 * from the default palette: the two site accents against near-black, slowed
 * right down, and held at low opacity so it reads as atmosphere rather than
 * as "a Vanta background".
 */
export function VantaLayer({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const FOG = resolveFactory(fogModule)
    if (!FOG) return

    let effect: VantaEffect | null = null
    try {
      effect = FOG({
        el: host,
        THREE,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        highlightColor: 0xff5a2b, // flare
        midtoneColor: 0x4d7cff,   // ion
        lowlightColor: 0x14141c,  // ink-700
        baseColor: 0x060608,      // ink-900
        blurFactor: 0.75,
        speed: 0.7,
        zoom: 0.55,
      })
    } catch {
      // Vanta pins expectations about the three.js build it runs against.
      // If that contract ever breaks, the section keeps its flat background
      // rather than taking the page down with it.
      return
    }

    return () => effect?.destroy()
  }, [])

  return <div ref={hostRef} aria-hidden="true" className={`absolute inset-0 ${className}`} />
}
