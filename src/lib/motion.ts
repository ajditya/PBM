import type { Variants } from "framer-motion"

/**
 * Editorial easing curves and shared Framer Motion variants.
 * Default everywhere = easeOutExpo. Slow, deliberate, never bouncy.
 */

export const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const easeInExpo: [number, number, number, number] = [0.7, 0, 0.84, 0]
export const easeInOutExpo: [number, number, number, number] = [0.87, 0, 0.13, 1]

export const durations = {
  fast: 0.4,
  base: 0.6,
  slow: 1.0,
  curtain: 0.8,
  reveal: 1.2,
} as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easeOutExpo },
  },
}

export const fadeUpSlow: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.reveal, ease: easeOutExpo },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easeOutExpo },
  },
}

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.2 },
  },
}

/** Horizontal line that draws in from left to right. Wrap target with origin-left. */
export const drawLineX: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
}

/** Vertical line drawing top to bottom. */
export const drawLineY: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.0, ease: easeOutExpo },
  },
}

/** Subtle image reveal — fade with slight scale settle. */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.reveal, ease: easeOutExpo },
  },
}

/** Page curtain — solid panel sweeping up from bottom. Used in PageTransition. */
export const curtain: Variants = {
  initial: { y: "100%" },
  animate: { y: "100%" },
  exit: {
    y: 0,
    transition: { duration: durations.curtain, ease: easeOutExpo },
  },
}

/** Common viewport options for scroll-triggered reveals. */
export const viewportDefault = { once: true, margin: "-10% 0px -10% 0px" } as const
