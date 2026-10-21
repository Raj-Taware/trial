/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ALL SITE COPY LIVES HERE. Components read from this file and contain no
 *  copy of their own, so this is the only file to edit to change the site.
 *
 *  Every figure below is taken from Raj's CV or from the public repository
 *  it describes. Nothing here is estimated — if a number is not verifiable,
 *  the project omits its metric rather than carrying an invented one.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const identity = {
  name: "RAJ TAWARE",
  role: "AI Safety & Interpretability",
  location: "Goa / Gurugram, India",
  email: "rajmtaware@gmail.com",
  /** The single declarative line that carries the whole first screen. */
  thesis: "A model's explanation is not its reason. I measure the gap.",
  availability: "B.E. 2027 · BITS Pilani, Goa",
}

/** Act I → II bridge. Read one phrase at a time as the section is pinned. */
export const manifesto: string[] = [
  "A model can give you the right answer.",
  "It can also tell you why.",
  "Those are two different systems —",
  "and only one of them is load-bearing.",
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
  /** Omitted where no published figure exists. Never estimated. */
  metric?: { value: number; suffix?: string; decimals?: number; label: string }
  /** Omitted for unpublished work, which then renders as plain text. */
  href?: string
  /** Shown in place of a link when the work is not yet public. */
  status?: string
}

export const projects: Project[] = [
  {
    id: "behavioural-eval",
    index: "01",
    title: "Stated Reasons vs. Real Ones",
    accent: "flare",
    year: "2026",
    role: "Research — under review",
    stack: ["Activation Patching", "Paired Bootstrap", "LLM-Judge"],
    summary:
      "Controlled behavioural evaluations across five open-weight model families — minimal pairs, content-preserving interventions, temperature sweeps — comparing what a model outputs against the justification it gives for it. Logit-level activation patching then localises which residual-stream layers are actually carrying the decision, validated by targeted ablations.",
    metric: { value: 10000, label: "Bootstrap resamples" },
    status: "Under review — AAAI AI Alignment Track",
  },
  {
    id: "representational-competition",
    index: "02",
    title: "Alignment Fragility",
    accent: "ion",
    year: "2026",
    role: "Research",
    stack: ["Activation Steering", "Sobel Mediation", "vLLM"],
    summary:
      "Tests whether safety-alignment fragility comes from safety and capability features competing for the same finite transformer substrate. The refusal direction is extracted from contrastive activation pairs on Llama-3.1-8B and 70B, then a norm-invariant steering test links that internal signal causally to observed refusals.",
    metric: { value: 1, decimals: 2, label: "Refusal-direction AUROC, held out (layers 16–31)" },
  },
  {
    id: "cotwatch",
    index: "03",
    title: "cotwatch",
    accent: "flare",
    year: "2026",
    role: "Library & CLI",
    stack: ["Python", "Truncation Probes", "Preregistration"],
    summary:
      "An installable library operationalising truncation and hint-injection probes, to test whether a model's stated reasoning is causally upstream of its answer or merely narrated alongside it. Reports bootstrap confidence intervals against a no-CoT baseline, with preregistered falsification checks run before any compute is committed.",
    href: "https://github.com/Raj-Taware/cotwatch",
  },
  {
    id: "specsaboteur",
    index: "04",
    title: "SpecSaboteur",
    accent: "ion",
    year: "2026",
    role: "Apart Research Hackathon",
    stack: ["Dafny", "Z3", "LLM-as-Judge"],
    summary:
      "Generates malicious-compliance implementations — programs that satisfy a formal specification while violating its intent — verified by the Dafny theorem prover over Z3. The dual of CEGIS: instead of finding a program that meets the spec, it finds the spec's blind spots.",
    metric: { value: 100, suffix: "%", label: "Gap detection on weak specs, ≤2 refinement iterations" },
    href: "https://github.com/Raj-Taware/specsaboteur",
  },
  {
    id: "collusion-net",
    index: "05",
    title: "Catching Colluding Agents",
    accent: "flare",
    year: "2026",
    role: "Apart Research Sprint",
    stack: ["Information Theory", "Permutation Tests", "LLM Agents"],
    summary:
      "Can an auditor tell two agents are secretly cooperating from their actions alone? Reproducing the published net-influence detector surfaced a fixed threshold that fails in both directions — falsely accusing innocent pairs in up to 38% of short games while never catching weak collusion at all. A within-state permutation test holds false alarms near 2% and keeps gaining power with data.",
    metric: { value: 93, suffix: "%", label: "Weak-collusion detection, vs 15% for the fixed threshold" },
    href: "https://github.com/Raj-Taware/collusion-net-influence",
  },
]

export type Role = {
  org: string
  title: string
  place: string
  period: string
  body: string
}

/** Act III. The timeline metaphor made literal. */
export const trajectory: Role[] = [
  {
    org: "American Express",
    title: "AI Product Intern",
    place: "Gurugram",
    period: "Jun 2026 — Present",
    body: "AI product work inside Global Risk & Compliance, supporting development for risk-facing workflows: scoping requirements with cross-functional stakeholders, iterating on prototypes, and surfacing model behaviour so product decisions rest on it.",
  },
  {
    org: "BITS Pilani, Goa",
    title: "Teaching Assistant — OOP",
    place: "Goa",
    period: "Jan 2026 — Present",
    body: "Mentoring students on object-oriented design, abstraction, modular architecture and debugging in Java, alongside assignment evaluation and systems-level programming.",
  },
  {
    org: "FLIP",
    title: "AI Intern",
    place: "Remote",
    period: "Oct 2025 — Jan 2026",
    body: "Deployed GenAI agent systems on AWS with evaluator loops and human-in-the-loop checkpoints to catch failure modes in production. Built fault-isolated ingestion pipelines with retry logic and structured error logging.",
  },
  {
    org: "India Meteorological Department",
    title: "Machine Learning Intern",
    place: "Pune",
    period: "May 2025 — Jul 2025",
    body: "End-to-end evaluation pipeline for long-range imputation of 15-minute meteorological series across Automatic Weather Stations. Benchmarked LSTM, BiRNN, Transformer and TFT under real sparsity constraints, reaching R² = 0.975 on rainfall prediction.",
  },
  {
    org: "BITS Pilani, Goa",
    title: "B.E. Electrical & Electronics, Minor in Data Science",
    place: "Goa",
    period: "Aug 2023 — May 2027",
    body: "GPA 7.28 / 10.0. Coursework in NLP, machine learning, neural networks, information retrieval, operating systems and OOP.",
  },
]

export const capabilities = [
  {
    title: "Mechanistic Interpretability",
    body: "Activation patching, activation steering, refusal-direction extraction from contrastive pairs, and mediation analysis that ties an internal signal to the behaviour it supposedly causes.",
  },
  {
    title: "Behavioural Evaluation",
    body: "Minimal-pair prompts, content-preserving interventions, paraphrase and temperature sweeps, and independent LLM-judge scoring run across model families rather than a single favourite.",
  },
  {
    title: "Statistical Discipline",
    body: "Paired bootstrap resampling, AUROC on held-out validation, preregistered falsification checks, and permutation tests that keep false-alarm rates where they are supposed to be.",
  },
  {
    title: "Systems That Re-run",
    body: "vLLM and HuggingFace Transformers on AMD MI300X, GenAI agents on AWS, Dafny and Z3 verification, and caching that lets a result be rebuilt without the GPU that produced it.",
  },
]

/** Words that ride the velocity-reactive marquee between acts. */
export const marqueeWords = [
  "INTERPRETABILITY",
  "FAITHFULNESS",
  "ACTIVATION PATCHING",
  "REFUSAL",
  "EVALUATION",
  "COLLUSION",
]

/** Section headings, kept here so no copy lives inside a component. */
export const headings = {
  work: "Selected Research",
  workCoda: "Older work on request.",
  capabilities: "What the work actually consists of.",
  trajectory: "Trajectory",
  contactLead:
    "If you are working on making model behaviour legible, I would like to hear about it.",
}

export const chapters = [
  { id: "hero", label: "Arrival" },
  { id: "manifesto", label: "Thesis" },
  { id: "work", label: "Research" },
  { id: "capabilities", label: "Craft" },
  { id: "trajectory", label: "Trajectory" },
  { id: "contact", label: "Invitation" },
] as const

export const socials = [
  { label: "GitHub", href: "https://github.com/Raj-Taware" },
  { label: "LinkedIn", href: "https://linkedin.com/in/raj-taware" },
]
