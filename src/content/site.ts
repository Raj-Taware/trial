/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ALL SITE COPY LIVES HERE.  EVERY STRING BELOW IS A PLACEHOLDER.
 *  Replace the values; do not touch the components. Nothing here is real.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const identity = {
  name: "YOUR NAME",
  role: "Interactive Engineer",
  location: "PLACEHOLDER City, XX",
  email: "hello@example.com",
  /** The single declarative line that carries the whole first screen. */
  thesis: "I build interfaces that behave like objects, not documents.",
  availability: "Open to select work — 2026",
}

/** Act I → II bridge. Read one phrase at a time as the section is pinned. */
export const manifesto: string[] = [
  "Most sites are read.",
  "The good ones are travelled through.",
  "The difference is not decoration —",
  "it is whether the thing responds.",
]

export type Project = {
  id: string
  index: string
  title: string
  /** Drives the colour bleed when this project is focused. */
  accent: "flare" | "ion"
  year: string
  role: string
  stack: string[]
  summary: string
  /** One hard number. Vague claims read as filler. */
  metric: { value: number; suffix: string; label: string }
  href: string
}

export const projects: Project[] = [
  {
    id: "atlas",
    index: "01",
    title: "Placeholder Atlas",
    accent: "flare",
    year: "2025",
    role: "Design + Build",
    stack: ["WebGL", "React", "GSAP"],
    summary:
      "PLACEHOLDER — one or two sentences on the actual problem, not the technology. What was broken before you arrived, and what is true now.",
    metric: { value: 94, suffix: "%", label: "Placeholder metric" },
    href: "#",
  },
  {
    id: "signal",
    index: "02",
    title: "Placeholder Signal",
    accent: "ion",
    year: "2025",
    role: "Lead Engineer",
    stack: ["TypeScript", "Three.js", "Node"],
    summary:
      "PLACEHOLDER — describe the constraint that made this hard. Constraints are what make a case study credible.",
    metric: { value: 12, suffix: "ms", label: "Placeholder metric" },
    href: "#",
  },
  {
    id: "drift",
    index: "03",
    title: "Placeholder Drift",
    accent: "flare",
    year: "2024",
    role: "Creative Direction",
    stack: ["Shaders", "Motion", "Systems"],
    summary:
      "PLACEHOLDER — say what you decided, not just what you delivered. Decisions are the portfolio.",
    metric: { value: 3, suffix: "×", label: "Placeholder metric" },
    href: "#",
  },
  {
    id: "quarry",
    index: "04",
    title: "Placeholder Quarry",
    accent: "ion",
    year: "2024",
    role: "Design Engineer",
    stack: ["Design Systems", "React", "A11y"],
    summary:
      "PLACEHOLDER — end on the outcome someone else cared about. Not the framework you enjoyed.",
    metric: { value: 40, suffix: "k", label: "Placeholder metric" },
    href: "#",
  },
]

export const capabilities = [
  {
    title: "Motion Systems",
    body: "PLACEHOLDER — scroll choreography, state transitions, and the timing rules that keep them coherent across a product.",
  },
  {
    title: "Real-time Graphics",
    body: "PLACEHOLDER — GLSL, generative fields, and knowing when a shader is the wrong answer.",
  },
  {
    title: "Interface Architecture",
    body: "PLACEHOLDER — component systems that survive a second and third team touching them.",
  },
  {
    title: "Performance",
    body: "PLACEHOLDER — budgets held under load. Sixty frames is a requirement, not a stretch goal.",
  },
]

/** Words that ride the velocity-reactive marquee between acts. */
export const marqueeWords = [
  "SHADERS",
  "SCROLL",
  "TYPOGRAPHY",
  "SYSTEMS",
  "LATENCY",
  "CRAFT",
]

export const chapters = [
  { id: "hero", label: "Arrival" },
  { id: "manifesto", label: "Thesis" },
  { id: "work", label: "Work" },
  { id: "capabilities", label: "Craft" },
  { id: "contact", label: "Invitation" },
] as const

export const socials = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "Are.na", href: "https://are.na/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
]
