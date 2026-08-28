/**
 * Single source of truth for the cup's transform.
 *
 * `cupTransform` is a plain mutable object read every frame by <Cup />.
 * Future sections can animate the cup by tweening this object directly:
 *
 *   import { gsap } from 'gsap'
 *   import { cupTransform, CUP_STATES } from './scene/cupState'
 *   gsap.to(cupTransform, { ...CUP_STATES.drinks, duration: 1.2, ease: 'power3.inOut' })
 *
 * Keep every hard-coded cup number in this file.
 */

// Named layout states, one per section. Flat keys so gsap can tween them.
export const CUP_STATES = {
  hero: {
    x: 0,
    y: -0.34,
    z: 0,
    // Lean the top toward the camera so the lid and drink read clearly.
    rotX: 0.3,
    rotY: 0,
    rotZ: 0,
    scale: 0.8,
  },
  welcome: {
    x: 1.2,
    y: 0.02,
    z: 0.2,
    rotX: 0.24,
    rotY: -0.3,
    rotZ: -0.08,
    scale: 0.88,
  },
  // Placeholders for upcoming sections — safe to retune.
  drinks: {
    x: 0,
    y: 0.25,
    z: 0.25,
    rotX: 0.36,
    rotY: 0,
    rotZ: 0,
    scale: 0.7,
  },
  experience: {
    // Keep the green matcha band centred as the cup grows past the viewport.
    x: 0,
    y: -1.02,
    z: 1.55,
    rotX: 0.08,
    rotY: 0,
    rotZ: 0,
    scale: 3.6,
  },
  story: {
    x: 1.4,
    y: 0.2,
    z: -0.6,
    rotX: 0.3,
    rotY: -0.5,
    rotZ: 0.1,
    scale: 1.15,
  },
}

// Ambient motion layered on top of the state transform.
export const CUP_MOTION = {
  floatAmplitude: 0.07, // world units
  floatSpeed: 0.9, // radians / second
  mouseYaw: 0.55, // horizontal rotation controlled by the mouse
  mousePitch: 0.16, // subtle vertical rotation controlled by the mouse
  parallaxDamping: 3.2, // higher = snappier follow
}

// The cup model, and how it is normalised into world units.
// The GLB arrives at an arbitrary size and origin, so it is auto-centred and
// scaled to `fitHeight` — that way `scale: 1` in CUP_STATES always means the
// same on-screen size, whatever model is swapped in here.
export const CUP_MODEL = {
  url: '/models/matcha-latte-web-meshopt.glb',
  fitHeight: 1.8, // world units, tallest axis of the model
}

// The printed wordmark. It sits directly on the cup wall — no band — so the
// radius is sampled from the model's own geometry at the label's height.
// Vertical placement is a fraction of the normalised model height (0 = base,
// 1 = lid) so it stays put if fitHeight changes.
export const CUP_LABEL = {
  text: 'MATCHAI',
  font: '/fonts/Oswald-Bold.ttf', // the brand face, matching matchai.ma
  centerAt: 0.5, // higher on the white/milk zone
  fontSizeRatio: 0.13, // cap height, as a fraction of model height
  tracking: 1.0, // multiplies the font's own advance widths
  textLift: 0.0015, // hugs the cup wall like a printed mark
}

// Live transform the renderer reads. Starts at the hero state.
export const cupTransform = { ...CUP_STATES.hero }

/** Snap the live transform to a named state without animating. */
export function setCupState(name) {
  Object.assign(cupTransform, CUP_STATES[name])
}
