import { useEffect, useRef } from "react"
import * as THREE from "three"

/**
 * The hero's generative field: domain-warped fBm noise, coloured by the two
 * site accents and driven by pointer + scroll.
 *
 * Written by hand rather than pulled from a preset library — Vanta's effects
 * are recognisable on sight, and a portfolio background that people can name
 * is doing the opposite of its job.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Geometry is already a clip-space quad; skip the matrix multiply.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uPointer;
  uniform float uScroll;
  uniform float uIntensity;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Aspect-corrected coordinates so the field never stretches on wide screens.
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.4;

    float t = uTime * 0.06;

    // Pointer pulls the field toward the cursor — subtle, but it is what makes
    // the background read as responsive rather than looping.
    p += uPointer * 0.35;

    // Two rounds of domain warping. One looks like noise; two looks like fluid.
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4),
      fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 1.1)
    );
    float f = fbm(p + 3.2 * r);

    vec3 ink   = vec3(0.023, 0.023, 0.031);
    vec3 ion   = vec3(0.302, 0.486, 1.000);
    vec3 flare = vec3(1.000, 0.353, 0.169);

    // Base ramp: ink → ion in the troughs, ink → flare in the ridges.
    vec3 col = mix(ink, ion * 0.55, clamp(length(q) * 0.9, 0.0, 1.0));
    col = mix(col, flare, clamp(pow(f, 2.4) * 1.6, 0.0, 1.0));

    // Filament highlights where the warp folds back on itself.
    float filament = smoothstep(0.62, 0.78, f) * (1.0 - smoothstep(0.82, 0.96, f));
    col += flare * filament * 0.5;
    col += ion * smoothstep(0.35, 0.05, f) * 0.18;

    // Vignette keeps the type legible against the brightest folds.
    float vig = 1.0 - smoothstep(0.35, 1.15, length(uv - 0.5) * 1.6);
    col *= mix(0.35, 1.0, vig);

    // Scrolling drains the field so the next act starts from near-black.
    col *= uIntensity * (1.0 - uScroll * 0.85);

    gl_FragColor = vec4(col, 1.0);
  }
`

export function ShaderField({
  className = "",
  still = false,
}: {
  className?: string
  /** Render one frame and stop. Used when the visitor asked for less motion:
   *  they still get the artwork, just not a background that never settles. */
  still?: boolean
}) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" })
    } catch {
      // No WebGL context available — the CSS gradient underneath stands in.
      return
    }

    // Capping DPR is the single biggest win for a full-screen fragment shader;
    // above ~1.75 the extra pixels are invisible and cost real frames.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(host.clientWidth, host.clientHeight)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(host.clientWidth, host.clientHeight) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uIntensity: { value: 0 },
    }

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }),
    )
    scene.add(mesh)

    const pointerTarget = new THREE.Vector2(0, 0)
    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      )
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    const onResize = () => {
      if (!host.clientWidth) return
      renderer.setSize(host.clientWidth, host.clientHeight)
      uniforms.uRes.value.set(host.clientWidth, host.clientHeight)
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(host)

    // Pause entirely when the field scrolls off-screen or the tab is hidden.
    // A shader running behind other content is pure battery drain.
    let onScreen = true
    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting }, { threshold: 0 })
    io.observe(host)

    const clock = new THREE.Clock()
    let frame = 0

    if (still) {
      // One composed frame at a pleasing point in the animation, then nothing.
      uniforms.uIntensity.value = 1
      uniforms.uTime.value = 12
      renderer.render(scene, camera)

      return () => {
        resizeObserver.disconnect()
        io.disconnect()
        window.removeEventListener("pointermove", onPointerMove)
        mesh.geometry.dispose()
        ;(mesh.material as THREE.ShaderMaterial).dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    const render = () => {
      frame = requestAnimationFrame(render)
      if (!onScreen || document.hidden) return

      uniforms.uTime.value = clock.getElapsedTime()

      // Ease the pointer instead of tracking it exactly — raw values feel twitchy.
      uniforms.uPointer.value.lerp(pointerTarget, 0.045)

      const progress = window.scrollY / Math.max(window.innerHeight, 1)
      uniforms.uScroll.value = Math.min(progress, 1)

      // Fade the field in on first paint rather than popping it.
      uniforms.uIntensity.value += (1 - uniforms.uIntensity.value) * 0.02

      renderer.render(scene, camera)
    }
    render()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onPointerMove)
      resizeObserver.disconnect()
      io.disconnect()
      mesh.geometry.dispose()
      ;(mesh.material as THREE.ShaderMaterial).dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [still])

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#171426_0%,#060608_70%)] ${className}`}
    />
  )
}
