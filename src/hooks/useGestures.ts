/**
 * Gesture hooks — usePan, usePinch, useLongPress
 *
 * All hooks use native DOM pointer/touch events attached via useRef.
 * No React synthetic events — prevents issues with passive listeners,
 * allows preventDefault for scroll suppression, and works correctly
 * inside Capacitor WKWebView.
 *
 * Usage pattern: each hook returns a `ref` you attach to the target element.
 *
 * ```tsx
 * // usePan
 * const panRef = usePan({
 *   onMove: ({ dx, dy, vx, vy }) => console.log(dx, dy),
 *   onEnd:  ({ dx, dy, vx, vy }) => console.log('released with velocity', vx, vy),
 * });
 * <div ref={panRef} style={{ touchAction: 'none' }} />
 *
 * // usePinch
 * const pinchRef = usePinch({
 *   onMove: ({ scale, origin }) => console.log('scale', scale),
 * });
 * <div ref={pinchRef} style={{ touchAction: 'none' }} />
 *
 * // useLongPress
 * const lpRef = useLongPress({
 *   onLongPress: () => console.log('held!'),
 * });
 * <button ref={lpRef} />
 * ```
 */

import { useEffect, useRef, type RefObject } from 'react';
import { hapticMedium } from '../haptics';

// ═════════════════════════════════════════════════════════════════════════════
// usePan
// ═════════════════════════════════════════════════════════════════════════════

export interface PanState {
  /** X displacement from gesture start (px) */
  dx: number;
  /** Y displacement from gesture start (px) */
  dy: number;
  /** X velocity (px/ms, positive = right) */
  vx: number;
  /** Y velocity (px/ms, positive = down) */
  vy: number;
  /** Raw current pointer position */
  x: number;
  y: number;
}

export interface UsePanOptions {
  onStart?: (state: PanState) => void;
  onMove?:  (state: PanState) => void;
  onEnd?:   (state: PanState) => void;
  /**
   * Prevent the default touchmove/scroll during panning.
   * Set false when you want vertical scrolling to coexist with horizontal panning.
   * Default: true.
   */
  preventDefault?: boolean;
}

/**
 * usePan — track drag delta and velocity using native pointer events.
 *
 * Attaches `pointerdown` / `pointermove` / `pointerup` / `pointercancel`
 * directly to the DOM element via the returned ref.
 *
 * Set `touch-action: none` on the target element to prevent browser scroll
 * interference (the hook does NOT set this for you).
 */
export function usePan(options: UsePanOptions = {}): RefObject<HTMLElement | null> {
  const ref     = useRef<HTMLElement>(null);
  const optsRef = useRef(options);
  optsRef.current = options;   // always fresh — no stale closures

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0, startY = 0;
    let lastX  = 0, lastY  = 0;
    let lastT  = 0;
    let vx     = 0, vy     = 0;
    let active = false;

    const buildState = (x: number, y: number): PanState => ({
      dx: x - startX,
      dy: y - startY,
      vx, vy,
      x, y,
    });

    const onDown = (e: PointerEvent) => {
      // Only primary pointer (ignore multi-touch for usePan)
      if (!e.isPrimary) return;
      startX = e.clientX; startY = e.clientY;
      lastX  = e.clientX; lastY  = e.clientY;
      lastT  = e.timeStamp;
      vx = 0; vy = 0;
      active = true;
      el.setPointerCapture(e.pointerId);
      optsRef.current.onStart?.(buildState(e.clientX, e.clientY));
    };

    const onMove = (e: PointerEvent) => {
      if (!active || !e.isPrimary) return;
      if (optsRef.current.preventDefault !== false) e.preventDefault();

      const dt = e.timeStamp - lastT;
      if (dt > 0) {
        // Exponential moving average for velocity smoothing
        const alpha = 0.7;
        vx = alpha * ((e.clientX - lastX) / dt) + (1 - alpha) * vx;
        vy = alpha * ((e.clientY - lastY) / dt) + (1 - alpha) * vy;
      }
      lastX = e.clientX; lastY = e.clientY; lastT = e.timeStamp;

      optsRef.current.onMove?.(buildState(e.clientX, e.clientY));
    };

    const onUp = (e: PointerEvent) => {
      if (!active || !e.isPrimary) return;
      active = false;
      optsRef.current.onEnd?.(buildState(e.clientX, e.clientY));
    };

    el.addEventListener('pointerdown',   onDown,  { passive: true });
    el.addEventListener('pointermove',   onMove,  { passive: false });
    el.addEventListener('pointerup',     onUp,    { passive: true });
    el.addEventListener('pointercancel', onUp,    { passive: true });

    return () => {
      el.removeEventListener('pointerdown',   onDown);
      el.removeEventListener('pointermove',   onMove);
      el.removeEventListener('pointerup',     onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []); // attach once — handlers stay fresh via optsRef

  return ref;
}

// ═════════════════════════════════════════════════════════════════════════════
// usePinch
// ═════════════════════════════════════════════════════════════════════════════

export interface PinchState {
  /**
   * Scale ratio since gesture start.
   * 1.0 = no change, 2.0 = double size, 0.5 = half size.
   */
  scale: number;
  /**
   * Midpoint between the two touch contacts (px from viewport top-left).
   * Useful for transforming around the pinch origin.
   */
  origin: [number, number];
}

export interface UsePinchOptions {
  onStart?: (state: PinchState) => void;
  onMove?:  (state: PinchState) => void;
  onEnd?:   (state: PinchState) => void;
}

function getTouchDistance(touches: TouchList): number {
  const [a, b] = [touches[0], touches[1]];
  const dx = b.clientX - a.clientX;
  const dy = b.clientY - a.clientY;
  return Math.hypot(dx, dy);
}

function getTouchMidpoint(touches: TouchList): [number, number] {
  return [
    (touches[0].clientX + touches[1].clientX) / 2,
    (touches[0].clientY + touches[1].clientY) / 2,
  ];
}

/**
 * usePinch — two-finger scale gesture using native touch events.
 *
 * Uses `touchstart` / `touchmove` / `touchend` (not pointer events) because
 * pinch requires simultaneous multi-touch tracking which pointer events
 * handle less cleanly across platforms.
 *
 * Set `touch-action: none` on the target element.
 */
export function usePinch(options: UsePinchOptions = {}): RefObject<HTMLElement | null> {
  const ref     = useRef<HTMLElement>(null);
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startDist = 0;
    let active    = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      startDist = getTouchDistance(e.touches);
      active    = true;
      const origin = getTouchMidpoint(e.touches);
      optsRef.current.onStart?.({ scale: 1, origin });
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!active || e.touches.length !== 2) return;
      e.preventDefault();
      const dist   = getTouchDistance(e.touches);
      const scale  = startDist > 0 ? dist / startDist : 1;
      const origin = getTouchMidpoint(e.touches);
      optsRef.current.onMove?.({ scale, origin });
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!active) return;
      // Only fire end when we've dropped below 2 fingers
      if (e.touches.length < 2) {
        active = false;
        // Report last known state (we don't have coords in touchend's changedTouches cleanly)
        optsRef.current.onEnd?.({ scale: 1, origin: [0, 0] });
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    el.addEventListener('touchcancel', onTouchEnd,  { passive: true });

    return () => {
      el.removeEventListener('touchstart',  onTouchStart);
      el.removeEventListener('touchmove',   onTouchMove);
      el.removeEventListener('touchend',    onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return ref;
}

// ═════════════════════════════════════════════════════════════════════════════
// useLongPress
// ═════════════════════════════════════════════════════════════════════════════

export interface UseLongPressOptions {
  /** Called when the hold duration is reached. */
  onLongPress: () => void;
  /** Hold duration in ms. Default: 500. */
  delay?: number;
  /**
   * Fire haptic feedback when the long press triggers.
   * Default: true. Uses `hapticMedium`.
   */
  haptic?: boolean;
  /**
   * Movement threshold in px. If the pointer moves further than this
   * from the start, the long press is cancelled. Default: 10.
   */
  threshold?: number;
}

/**
 * useLongPress — 500ms hold gesture with optional haptic feedback.
 *
 * Attaches native `pointerdown` / `pointermove` / `pointerup` / `pointercancel`.
 * Cancels the timer if the pointer moves beyond `threshold` pixels.
 */
export function useLongPress(options: UseLongPressOptions): RefObject<HTMLElement | null> {
  const ref     = useRef<HTMLElement>(null);
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer:  ReturnType<typeof setTimeout> | null = null;
    let startX = 0, startY = 0;

    const cancel = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      startX = e.clientX; startY = e.clientY;
      cancel();

      const delay     = optsRef.current.delay     ?? 500;
      const doHaptic  = optsRef.current.haptic    !== false;

      timer = setTimeout(() => {
        timer = null;
        if (doHaptic) hapticMedium();
        optsRef.current.onLongPress();
      }, delay);
    };

    const onMove = (e: PointerEvent) => {
      if (!e.isPrimary || timer === null) return;
      const threshold = optsRef.current.threshold ?? 10;
      const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (dist > threshold) cancel();
    };

    el.addEventListener('pointerdown',   onDown,  { passive: true });
    el.addEventListener('pointermove',   onMove,  { passive: true });
    el.addEventListener('pointerup',     cancel,  { passive: true } as EventListenerOptions);
    el.addEventListener('pointercancel', cancel,  { passive: true } as EventListenerOptions);

    return () => {
      cancel();
      el.removeEventListener('pointerdown',   onDown);
      el.removeEventListener('pointermove',   onMove);
      el.removeEventListener('pointerup',     cancel as EventListener);
      el.removeEventListener('pointercancel', cancel as EventListener);
    };
  }, []);

  return ref;
}
