/**
 * Ichikara Design Tokens — TypeScript mirror of index.css @theme block.
 *
 * Use these constants when you need token values in JS/TS code (e.g. inline
 * styles, animation values, canvas drawing). For Tailwind class-based styling
 * prefer CSS var() references directly in className strings.
 *
 * Never hard-code colors, radii, or spacing in component logic — use tokens.
 */

// ── Colors ────────────────────────────────────────────────────────────────────

export const color = {
  // Brand primitives
  ink:      'var(--color-ink)',
  paper:    'var(--color-paper)',
  accent:   'var(--color-accent)',

  // Grammar colors
  noun:     'var(--color-noun)',
  topic:    'var(--color-topic)',
  subject:  'var(--color-subject)',
  object:   'var(--color-object)',
  verb:     'var(--color-verb)',
  particle: 'var(--color-particle)',

  // Semantic status
  success:  'var(--color-success)',
  warning:  'var(--color-warning)',
  danger:   'var(--color-danger)',
  muted:    'var(--color-muted)',
} as const;

export const surface = {
  bg:          'var(--surface-bg)',
  border:      'var(--surface-border)',
  active:      'var(--surface-active)',
  solid:       'var(--surface-solid)',
  solidHover:  'var(--surface-solid-hover)',
  divider:     'var(--surface-divider)',
  inputBg:     'var(--input-bg)',

  success:     'var(--surface-success)',
  warning:     'var(--surface-warning)',
  danger:      'var(--surface-danger)',
  info:        'var(--surface-info)',
} as const;

// ── Typography ────────────────────────────────────────────────────────────────

export const text = {
  '2xs':  'var(--text-2xs)',   // 11px
  xs:     'var(--text-xs)',    // 12px
  sm:     'var(--text-sm)',    // 13px
  base:   'var(--text-base)',  // 15px — iOS body
  md:     'var(--text-md)',    // 17px — iOS headline
  lg:     'var(--text-lg)',    // 20px
  xl:     'var(--text-xl)',    // 24px
  '2xl':  'var(--text-2xl)',   // 28px
  '3xl':  'var(--text-3xl)',   // 34px — iOS large title
} as const;

export const font = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────────

export const space = {
  0:    'var(--space-0)',
  0.5:  'var(--space-0-5)',   // 2px
  1:    'var(--space-1)',     // 4px
  1.5:  'var(--space-1-5)',   // 6px
  2:    'var(--space-2)',     // 8px
  2.5:  'var(--space-2-5)',   // 10px
  3:    'var(--space-3)',     // 12px
  3.5:  'var(--space-3-5)',   // 14px
  4:    'var(--space-4)',     // 16px
  5:    'var(--space-5)',     // 20px
  6:    'var(--space-6)',     // 24px
  7:    'var(--space-7)',     // 28px
  8:    'var(--space-8)',     // 32px
  10:   'var(--space-10)',    // 40px
  12:   'var(--space-12)',    // 48px
  16:   'var(--space-16)',    // 64px
} as const;

export const touchTarget = 'var(--touch-target)'; // 44px — Apple HIG minimum

// ── Border radius ─────────────────────────────────────────────────────────────

export const radius = {
  xs:   'var(--radius-xs)',   // 6px
  sm:   'var(--radius-sm)',   // 10px
  md:   'var(--radius-md)',   // 14px
  lg:   'var(--radius-lg)',   // 20px
  xl:   'var(--radius-xl)',   // 28px
  full: 'var(--radius-full)', // 9999px
} as const;

// ── Shadows ───────────────────────────────────────────────────────────────────

export const shadow = {
  xs:    'var(--shadow-xs)',
  sm:    'var(--shadow-sm)',
  md:    'var(--shadow-md)',
  lg:    'var(--shadow-lg)',
  float: 'var(--shadow-float)',  // floating UI (tab bar, sheets)
  glow:  'var(--shadow-glow)',   // accent glow / focus
} as const;

export const ring = {
  accent: 'var(--ring-accent)',  // accent focus ring (red)
  input:  'var(--ring-input)',   // input focus ring (blue)
} as const;

// ── Motion ────────────────────────────────────────────────────────────────────

export const duration = {
  fast: 'var(--duration-fast)',  // 150ms
  base: 'var(--duration-base)',  // 220ms
  slow: 'var(--duration-slow)',  // 380ms
} as const;

export const ease = {
  out:    'var(--ease-out)',
  spring: 'var(--ease-spring)',
  inOut:  'var(--ease-in-out)',
} as const;

export const transition = {
  fast:   'var(--transition-fast)',
  base:   'var(--transition-base)',
  spring: 'var(--transition-spring)',
} as const;

// ── Z-index layers ────────────────────────────────────────────────────────────

export const z = {
  base:    0,
  raised:  10,
  overlay: 40,
  modal:   50,
  toast:   60,
  top:     9999,
} as const;

// ── Composite export ──────────────────────────────────────────────────────────

/** All Ichikara design tokens in one object. */
export const tokens = {
  color,
  surface,
  text,
  font,
  space,
  touchTarget,
  radius,
  shadow,
  ring,
  duration,
  ease,
  transition,
  z,
} as const;
