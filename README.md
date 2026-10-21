# Raj Taware — Portfolio

A single-page portfolio built as one continuous shot rather than a stack of
sections. Scrolling doesn't move down a document; it travels through a
five-act sequence.

All copy lives in `src/content/site.ts` and nowhere else. Every figure in it
comes from the CV or from the public repository it describes — a project with
no published number carries no metric rather than an invented one, and only
public repositories are linked.

## The structure

| Act | Section | Mechanic |
| --- | --- | --- |
| Arrival | `Hero` | One declarative line over a hand-written GLSL field. No hero image, no buttons above the fold. |
| Thesis | `Manifesto` | The section pins and the wheel becomes a scrubber — one phrase at a time. This teaches the site's grammar. |
| Research | `Work` | Projects pass horizontally while pinned, like a dolly shot. The focused project bleeds its accent into a site-wide CSS variable. |
| Craft | `Capabilities` | A velocity-reactive marquee, then tilt-and-glare cards. |
| Trajectory | `Trajectory` | Roles and study as one descending rule. Deliberately the quietest section — this is the part a reader scans. |
| Invitation | `Contact` | Everything quiets down to one address. The contrast is the payoff. |

The chapter rail on the right is both the read-progress indicator and the
site's only navigation — a consequence of treating the page as a timeline.

## Where the pieces came from

| Library | Licence | How it is used |
| --- | --- | --- |
| [lenis](https://github.com/darkroomengineering/lenis) | MIT | Smooth scroll. Runs on *native* scroll, so anchors, `position: sticky` and find-on-page keep working. |
| [GSAP](https://github.com/greensock/GSAP) | Free, incl. commercial | ScrollTrigger, SplitText, ScrambleText, Flip. All bonus plugins ship free in the public package since Webflow's acquisition. |
| [Vanta](https://github.com/tengbao/vanta) | MIT | Exactly one use, in the final act, pushed far from its default palette. |
| [react-bits](https://github.com/DavidHDev/react-bits) | MIT + Commons Clause | Used as a **reference**, not a dependency — the marquee, scramble, count-up, tilt-glare and magnetic-link patterns are rebuilt here on the page's single GSAP ticker. |

Nothing from react-bits is redistributed, so the Commons Clause (which
restricts *selling* the library, not using it) is not in play.

### Why the patterns were rebuilt rather than installed

Each of those components normally runs its own `requestAnimationFrame` loop.
Five independent loops on one page is the usual cause of scroll-linked
animation jitter. Here there is one clock: GSAP's ticker drives Lenis, Lenis
drives ScrollTrigger, and every effect reads from it.

### Why the hero shader is hand-written

Vanta's presets are recognisable on sight. A portfolio background that a
visitor can name is doing the opposite of its job, so the hero uses a
domain-warped fBm field written for this site (`ShaderField.tsx`) — two rounds
of warping, because one looks like noise and two looks like fluid.

## Accessibility and the reduced-motion path

This is a requirement, not a toggle.

- `prefers-reduced-motion: reduce` removes Lenis entirely, drops the preloader
  and custom cursor, unpins every section, and renders the manifesto and work
  as ordinary readable stacks. Verified: all 4 phrases, 5 projects, 5 roles and
  4 capability cards present and visible.
- The hero shader renders **one still frame** rather than being removed —
  the artwork survives, the motion does not.
- Count-ups and scramble text render their final values in the DOM from the
  start, so assistive tech and crawlers never see the intermediate state.
- Focus outlines survive the custom cursor, and there is a skip link.
- `index.html` carries a `<noscript>` block with a working contact address.

## Performance

three.js and both WebGL layers are lazy-loaded, so they are not on the
critical path:

```
index    80.8 kB gzip   ← initial
gsap     59.7 kB gzip   ← initial
three   186.6 kB gzip   ← deferred
```

The shader caps device pixel ratio at 1.75 and pauses entirely when
off-screen or when the tab is hidden.

## Deployment

Pushing to `claude/portfolio-ui-design-bg8qnn` builds and publishes to GitHub
Pages via `.github/workflows/deploy.yml`. The typecheck runs as part of
`npm run build`, so a type error fails the deploy rather than shipping a
broken page.

Pages must be enabled once, by hand: **Settings → Pages → Source: GitHub
Actions**. The build uses `base: './'`, so the same output works at the Pages
project subpath, at a domain root, and from `npm run preview`.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Editing it

1. `src/content/site.ts` holds every string, project, metric, role and link.
   Components read from it and contain no copy of their own.
2. `index.html` carries the page metadata and the `<noscript>` fallback.
3. The two accents (`--color-flare`, `--color-ion`) live in `src/index.css`
   and propagate to the shader ramp, the chapter rail, the card borders and
   the per-project colour bleed.
4. Projects with `accent: "ion"` tint the page blue while focused; `"flare"`
   tints it orange. Alternating them is what gives the research section rhythm.

### Rules the content follows

- A project's `metric` is optional. Omit it rather than publish a figure that
  cannot be traced to the CV or the repository.
- A project's `href` is optional too. Unpublished work renders as plain text
  with its `status` (e.g. "Under review") instead of a link that 404s.
- Only public repositories are linked. This site is itself public.

## Known trade-offs

- The horizontal work section needs a real scroll distance to feel good; with
  fewer than three projects, consider dropping the pin.
- Vanta is a 2019-era library and its effects are dated. It earns its place
  here only because it is dimmed to atmosphere. If it ever breaks against a
  future three.js, `VantaLayer` fails closed and the section keeps its flat
  background.
