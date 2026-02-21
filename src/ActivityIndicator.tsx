/**
 * ActivityIndicator — iOS UIActivityIndicatorView equivalent.
 *
 * A circular spinner for loading states. Three flavours:
 *
 *   Standalone  — inline in any layout position.
 *   Overlay     — full-screen frosted modal with label + focus trap.
 *   (via Button) — pass `loading` prop to Button to replace label.
 *
 * Features:
 * - Pure CSS animation (no JS overhead)
 * - Respects prefers-reduced-motion (spins → gentle pulse)
 * - Token-driven colour — defaults to accent, accepts any CSS colour value
 * - Three sizes: sm (16px), md (24px), lg (36px)
 * - Overlay traps focus (via useFocusTrap) and locks body scroll
 *
 * Usage:
 * ```tsx
 * // Standalone
 * <ActivityIndicator />
 * <ActivityIndicator size="lg" color={tokens.color.accent} />
 *
 * // Full-screen overlay
 * <ActivityIndicator.Overlay visible={isLoading} label="Loading…" />
 *
 * // Button loading state (see Button's `loading` prop)
 * <Button loading>Save</Button>
 * ```
 */

import React, { useEffect, useRef } from 'react';
import { useFocusTrap } from './hooks/useFocusTrap';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ActivityIndicatorSize = 'sm' | 'md' | 'lg';

export interface ActivityIndicatorProps {
  /** Size preset. Default: 'md'. */
  size?: ActivityIndicatorSize;
  /**
   * Ring colour. Accepts any CSS colour value or token reference.
   * Default: `var(--color-accent)`.
   */
  color?: string;
  /** aria-label for screen readers. Default: 'Loading'. */
  'aria-label'?: string;
  className?: string;
}

export interface ActivityIndicatorOverlayProps {
  visible: boolean;
  /** Optional text shown below the spinner. */
  label?: string;
  /** Background opacity (0–1). Default: 0.5. */
  backdropOpacity?: number;
}

// ── Size map ──────────────────────────────────────────────────────────────────

const SIZE_PX: Record<ActivityIndicatorSize, number> = {
  sm: 16,
  md: 24,
  lg: 36,
};

const STROKE: Record<ActivityIndicatorSize, number> = {
  sm: 2,
  md: 2.5,
  lg: 3,
};

// ── Spinner ring ──────────────────────────────────────────────────────────────
// Uses SVG arc (same approach as PullToRefresh spinner) for a crisp,
// resolution-independent ring that works at all pixel densities.

function SpinnerRing({
  size,
  color,
  ariaLabel,
  className = '',
}: {
  size: ActivityIndicatorSize;
  color: string;
  ariaLabel: string;
  className?: string;
}) {
  const px = SIZE_PX[size];
  const sw = STROKE[size];
  const r  = (px - sw * 2) / 2;
  const cx = px / 2;
  const circumference = 2 * Math.PI * r;
  // Show ~75% of the ring as the active arc
  const dash   = circumference * 0.75;
  const gap    = circumference * 0.25;

  return (
    <svg
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuetext={ariaLabel}
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      className={['kami-spinner', className].filter(Boolean).join(' ')}
      style={{
        animationName:            'kami-spin',
        animationDuration:        '0.8s',
        animationTimingFunction:  'linear',
        animationIterationCount:  'infinite',
        flexShrink: 0,
        display: 'block',
      }}
    >
      {/* Track (faded) */}
      <circle
        cx={cx} cy={cx} r={r}
        stroke={color}
        strokeWidth={sw}
        strokeOpacity={0.2}
      />
      {/* Active arc */}
      <circle
        cx={cx} cy={cx} r={r}
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={0}
      />
    </svg>
  );
}

// ── ActivityIndicator ─────────────────────────────────────────────────────────

export function ActivityIndicator({
  size = 'md',
  color = 'var(--color-accent)',
  'aria-label': ariaLabel = 'Loading',
  className = '',
}: ActivityIndicatorProps) {
  return (
    <SpinnerRing
      size={size}
      color={color}
      ariaLabel={ariaLabel}
      className={className}
    />
  );
}

// ── Overlay ───────────────────────────────────────────────────────────────────

function Overlay({ visible, label, backdropOpacity = 0.5 }: ActivityIndicatorOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useFocusTrap(containerRef, visible);

  // Body scroll lock
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label ?? 'Loading'}
      aria-busy="true"
      ref={containerRef}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexDirection:  'column',
        gap:            16,
        backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      } as React.CSSProperties}
    >
      {/* Frosted card */}
      <div
        style={{
          background:   'var(--surface-solid)',
          borderRadius: 20,
          padding:      '28px 36px',
          display:      'flex',
          flexDirection:'column',
          alignItems:   'center',
          gap:          14,
          boxShadow:    'var(--shadow-float)',
          minWidth:     120,
        }}
      >
        <SpinnerRing size="lg" color="var(--color-accent)" ariaLabel={label ?? 'Loading'} />
        {label && (
          <p style={{
            fontSize:   15,
            fontWeight: 500,
            color:      'var(--color-ink)',
            margin:     0,
            lineHeight: 1.3,
            textAlign:  'center',
          }}>
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

// Attach Overlay as a static property so it's accessible as ActivityIndicator.Overlay
ActivityIndicator.Overlay = Overlay;

// Also export standalone for direct import
export { Overlay as ActivityIndicatorOverlay };

// ── Export helper type ────────────────────────────────────────────────────────

// Utility component type that includes the static .Overlay property
export type ActivityIndicatorComponent = typeof ActivityIndicator & {
  Overlay: typeof Overlay;
};
