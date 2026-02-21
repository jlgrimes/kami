/**
 * Animation primitives — spring physics + page transitions.
 *
 * Built on the Web Animations API. No GSAP. No heavy deps.
 * Works inside Capacitor WKWebView (iOS 14+).
 *
 * ## API overview
 *
 * ```ts
 * // Pre-built spring configs
 * import { springs, Presets, animate, pageTransition } from './animations';
 *
 * // Run an animation on a DOM element
 * animate(el, Presets.slideUp.enter);
 *
 * // iOS-style page push/pop
 * pageTransition(incoming, outgoing, 'push');
 * pageTransition(incoming, outgoing, 'pop');
 *
 * // Custom spring
 * const frames = spring({ stiffness: 200, damping: 20, mass: 1 });
 * animate(el, { keyframes: frames.map(v => ({ transform: `scale(${v})` })), ...frames.timing });
 * ```
 */

// ── Spring simulation ─────────────────────────────────────────────────────────

export interface SpringConfig {
  /** Hooke's constant. Higher = faster, snappier. (default: 200) */
  stiffness?: number;
  /** Friction. Higher = less oscillation. (default: 26) */
  damping?: number;
  /** Mass of the object. Higher = slower. (default: 1) */
  mass?: number;
  /** Sample resolution in ms. (default: 8) */
  dt?: number;
  /** Max simulation time in ms — prevent infinite loops. (default: 1200) */
  maxDuration?: number;
}

export interface SpringResult {
  /** Normalised values from 0 → 1 (with possible overshoot > 1 for underdamped springs) */
  values: number[];
  /** Total duration in ms */
  duration: number;
}

/**
 * Simulate a spring from 0 to 1.
 * Returns sampled normalised values usable as keyframe weights.
 */
export function spring(config: SpringConfig = {}): SpringResult {
  const {
    stiffness  = 200,
    damping    = 26,
    mass       = 1,
    dt         = 8,
    maxDuration = 1200,
  } = config;

  const values: number[] = [];
  let x = 0;        // position (0 = start, 1 = end)
  let v = 0;        // velocity
  let t = 0;

  const REST_THRESHOLD = 0.002;

  while (t < maxDuration) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v = v + a * (dt / 1000);
    x = x + v * (dt / 1000);
    values.push(x);
    t += dt;

    if (Math.abs(x - 1) < REST_THRESHOLD && Math.abs(v) < REST_THRESHOLD) break;
  }

  // Ensure last value is exactly 1
  if (values.length === 0) values.push(1);
  values[values.length - 1] = 1;

  return { values, duration: values.length * dt };
}

// ── Preset spring configs ─────────────────────────────────────────────────────

export const springs = {
  /** Snappy, iOS-feel. Great for UI elements. */
  default:  { stiffness: 200, damping: 26, mass: 1 },
  /** Bouncy — for fun interactions, not navigation. */
  bouncy:   { stiffness: 300, damping: 18, mass: 1 },
  /** Stiff, fast. For subtle feedback. */
  snappy:   { stiffness: 400, damping: 35, mass: 1 },
  /** Slow, gentle. For larger elements. */
  gentle:   { stiffness: 100, damping: 22, mass: 1.2 },
  /** Smooth eased in-out. For page transitions. */
  smooth:   { stiffness: 220, damping: 32, mass: 1 },
} satisfies Record<string, SpringConfig>;

// ── Keyframe builders ─────────────────────────────────────────────────────────

export type Keyframes = Keyframe[];

/**
 * Build opacity keyframes (fade in: 0 → 1).
 */
export function fadeInFrames(): Keyframes {
  return [{ opacity: 0 }, { opacity: 1 }];
}
export function fadeOutFrames(): Keyframes {
  return [{ opacity: 1 }, { opacity: 0 }];
}

/**
 * Build slide keyframes using spring physics.
 * @param from  CSS transform value to animate FROM (e.g. 'translateY(20px)')
 * @param to    CSS transform value to animate TO (e.g. 'translateY(0)')
 * @param config Spring config (default: springs.default)
 */
export function slideFrames(
  from: string,
  to: string,
  config: SpringConfig = springs.default,
): Keyframes {
  const { values } = spring(config);
  return values.map(v => ({
    transform: interpolateTransform(from, to, v),
    offset: undefined, // let the browser distribute evenly
  }));
}

/**
 * Linear interpolation between two numeric pixel/percentage values in a CSS transform.
 * Only handles simple `translate*` and `scale` for now.
 */
function interpolateTransform(from: string, to: string, t: number): string {
  // Extract numeric value from e.g. 'translateY(20px)' → 20
  const numFrom = parseFloat(from) || 0;
  const numTo   = parseFloat(to) || 0;
  const val     = numFrom + (numTo - numFrom) * t;
  // Replace the number in 'from' template with interpolated value
  return from.replace(/[-\d.]+/, String(Math.round(val * 100) / 100));
}

// ── Animation presets ─────────────────────────────────────────────────────────

export interface AnimationPreset {
  enter: { keyframes: Keyframes; timing: KeyframeAnimationOptions };
  exit:  { keyframes: Keyframes; timing: KeyframeAnimationOptions };
}

const defaultTiming = (duration: number): KeyframeAnimationOptions => ({
  duration,
  fill: 'forwards' as const,
});

function slidePreset(
  enterFrom: string,
  exitTo: string,
  config: SpringConfig = springs.default,
): AnimationPreset {
  const { duration } = spring(config);
  return {
    enter: {
      keyframes: [
        { opacity: 0, transform: enterFrom },
        { opacity: 1, transform: 'translateX(0) translateY(0) scale(1)' },
      ],
      timing: { ...defaultTiming(duration), easing: 'cubic-bezier(0.34, 1.28, 0.64, 1)' },
    },
    exit: {
      keyframes: [
        { opacity: 1, transform: 'translateX(0) translateY(0) scale(1)' },
        { opacity: 0, transform: exitTo },
      ],
      timing: defaultTiming(200),
    },
  };
}

export const Presets: Record<string, AnimationPreset> = {
  /** Slide up from bottom (modal / toast enter style) */
  slideUp: slidePreset('translateY(20px) scale(0.97)', 'translateY(12px) scale(0.98)'),

  /** Slide down from top */
  slideDown: slidePreset('translateY(-20px) scale(0.97)', 'translateY(-12px) scale(0.98)'),

  /** Slide in from right (iOS push) */
  slideRight: slidePreset('translateX(100%)', 'translateX(30%)'),

  /** Slide in from left (iOS pop) */
  slideLeft: slidePreset('translateX(-30%)', 'translateX(100%)'),

  /** Scale in (zoom from 0.92 to 1) */
  scale: {
    enter: {
      keyframes: [{ opacity: 0, transform: 'scale(0.92)' }, { opacity: 1, transform: 'scale(1)' }],
      timing: { duration: spring(springs.default).duration, fill: 'forwards', easing: 'cubic-bezier(0.34, 1.28, 0.64, 1)' },
    },
    exit: {
      keyframes: [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.95)' }],
      timing: defaultTiming(200),
    },
  },

  /** Pure fade (no movement) */
  fade: {
    enter: {
      keyframes: fadeInFrames(),
      timing: { duration: 220, fill: 'forwards', easing: 'ease-out' },
    },
    exit: {
      keyframes: fadeOutFrames(),
      timing: { duration: 160, fill: 'forwards', easing: 'ease-in' },
    },
  },
};

// ── Core animate() utility ────────────────────────────────────────────────────

/**
 * Run an animation on a DOM element. Returns the Animation object.
 * Cancels any previous pending animations on the same element first.
 *
 * @example
 *   animate(el, Presets.slideUp.enter);
 */
export function animate(
  el: HTMLElement | null | undefined,
  { keyframes, timing }: { keyframes: Keyframes; timing: KeyframeAnimationOptions },
): Animation | null {
  if (!el) return null;
  return el.animate(keyframes, timing);
}

// ── Page transitions (iOS push/pop) ───────────────────────────────────────────

export type TransitionType = 'push' | 'pop' | 'modal' | 'dismiss';

/**
 * iOS-style page transition between two page elements.
 *
 * @param incoming  The page sliding INTO view
 * @param outgoing  The page sliding OUT of view (may be null on first push)
 * @param type      'push' | 'pop' | 'modal' | 'dismiss'
 */
export function pageTransition(
  incoming: HTMLElement | null,
  outgoing: HTMLElement | null,
  type: TransitionType,
): void {
  const PUSH_DUR  = 360;
  const POP_DUR   = 300;
  const EASE_PUSH = 'cubic-bezier(0.28, 0.64, 0.34, 1)';
  const EASE_POP  = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

  switch (type) {
    case 'push': {
      // Incoming: slide in from right
      animate(incoming, {
        keyframes: [
          { transform: 'translateX(100%)', opacity: 0.8 },
          { transform: 'translateX(0)',    opacity: 1 },
        ],
        timing: { duration: PUSH_DUR, fill: 'forwards', easing: EASE_PUSH },
      });
      // Outgoing: slide slightly left (iOS parallax)
      animate(outgoing, {
        keyframes: [
          { transform: 'translateX(0)',     opacity: 1 },
          { transform: 'translateX(-28%)',  opacity: 0.6 },
        ],
        timing: { duration: PUSH_DUR, fill: 'forwards', easing: EASE_PUSH },
      });
      break;
    }
    case 'pop': {
      // Incoming: slide back from left
      animate(incoming, {
        keyframes: [
          { transform: 'translateX(-28%)', opacity: 0.6 },
          { transform: 'translateX(0)',    opacity: 1 },
        ],
        timing: { duration: POP_DUR, fill: 'forwards', easing: EASE_POP },
      });
      // Outgoing: slide out to right
      animate(outgoing, {
        keyframes: [
          { transform: 'translateX(0)',    opacity: 1 },
          { transform: 'translateX(100%)', opacity: 0.8 },
        ],
        timing: { duration: POP_DUR, fill: 'forwards', easing: EASE_POP },
      });
      break;
    }
    case 'modal': {
      // Incoming: slide up from bottom (full-screen modal)
      animate(incoming, {
        keyframes: [
          { transform: 'translateY(100%)', opacity: 0.9 },
          { transform: 'translateY(0)',    opacity: 1 },
        ],
        timing: { duration: PUSH_DUR, fill: 'forwards', easing: EASE_PUSH },
      });
      break;
    }
    case 'dismiss': {
      // Outgoing: slide down
      animate(outgoing, {
        keyframes: [
          { transform: 'translateY(0)',    opacity: 1 },
          { transform: 'translateY(100%)', opacity: 0.9 },
        ],
        timing: { duration: POP_DUR, fill: 'forwards', easing: EASE_POP },
      });
      break;
    }
  }
}

// ── useAnimation hook ─────────────────────────────────────────────────────────

import { useCallback, useRef } from 'react';

/**
 * useAnimation — React hook for triggering animations imperatively.
 *
 * @example
 *   const [ref, enter, exit] = useAnimation(Presets.slideUp);
 *   <div ref={ref}>…</div>
 *   // later:
 *   enter().then(() => …);
 */
export function useAnimation(preset: AnimationPreset) {
  const ref = useRef<HTMLElement>(null);

  const enter = useCallback((): Promise<void> => {
    const anim = animate(ref.current, preset.enter);
    if (!anim) return Promise.resolve();
    return new Promise(resolve => { anim.onfinish = () => resolve(); });
  }, [preset]);

  const exit = useCallback((): Promise<void> => {
    const anim = animate(ref.current, preset.exit);
    if (!anim) return Promise.resolve();
    return new Promise(resolve => { anim.onfinish = () => resolve(); });
  }, [preset]);

  return [ref, enter, exit] as const;
}
