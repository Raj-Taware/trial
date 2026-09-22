import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { Flip } from "gsap/Flip"

/**
 * Every GSAP plugin below ships free in the public package as of 3.13+
 * (Webflow released the bonus plugins). Registered once, here.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Flip)

/** Shared timing language. Reusing these is what makes the site feel authored. */
export const EASE = {
  out: "expo.out",
  inOut: "power3.inOut",
  soft: "power2.out",
} as const

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, Flip }
