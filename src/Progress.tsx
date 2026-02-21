/**
 * Progress — two composable primitives for tracking advancement.
 *
 *   ProgressBar  — horizontal iOS-style track (UIProgressView feel).
 *                  Used for course completion, lesson mastery, upload/download.
 *
 *   StepDots     — expanding pill dot stepper for quiz / onboarding flows.
 *                  Active step expands into a capsule; past steps fill with
 *                  accent at 30% opacity; future steps stay empty (gray).
 *
 * Both are:
 *   ✓ Design-token driven — zero hard-coded colours
 *   ✓ Zero external dependencies
 *   ✓ Capacitor / WKWebView safe (no ResizeObserver, no unsupported CSS)
 *   ✓ Accessible (role + aria attributes)
 *   ✓ Animates with CSS transitions only (GPU-composited where possible)
 *
 * Usage:
 * ```tsx
 * // Linear progress
 * <ProgressBar value={72} />
 * <ProgressBar value={completedCount} max={totalLessons} size="sm" showLabel />
 *
 * // Quiz / onboarding steps
 * <StepDots total={5} current={2} />
 * ```
 */

import React from 'react';

// ═════════════════════════════════════════════════════════════════════════════
// ProgressBar
// ═════════════════════════════════════════════════════════════════════════════

export type ProgressBarSize    = 'xs' | 'sm' | 'md' | 'lg';
export type ProgressBarVariant = 'accent' | 'success' | 'warning' | 'danger' | 'muted';

export interface ProgressBarProps {
  /**
   * Current value. Interpreted as a percentage (0–100) when `max` is omitted,
   * or as a raw count when `max` is provided.
   */
  value: number;
  /** Total. Defaults to 100 (percentage mode). */
  max?: number;
  /** Track height preset. Default: 'sm' (6 px) — matches Home.tsx bar. */
  size?: ProgressBarSize;
  /** Fill colour. Default: 'accent'. */
  variant?: ProgressBarVariant;
  /** Show "{value} / {max}" label left and "{pct}%" right. */
  showLabel?: boolean;
  /** Custom left label. Overrides the default "{value} / {max}" text. */
  label?: string;
  /** Animate the fill on mount and when value changes. Default: true. */
  animated?: boolean;
  /** aria-label for the progressbar element. */
  'aria-label'?: string;
  className?: string;
}

/** Track height in px for each size preset. */
const BAR_HEIGHT: Record<ProgressBarSize, number> = {
  xs: 3,
  sm: 6,
  md: 8,
  lg: 12,
};

/** CSS color for the filled portion. */
const BAR_FILL: Record<ProgressBarVariant, string> = {
  accent:  'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
  muted:   'var(--color-muted)',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'sm',
  variant = 'accent',
  showLabel = false,
  label,
  animated = true,
  'aria-label': ariaLabel,
  className = '',
}: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, max));
  const pct       = max > 0 ? (safeValue / max) * 100 : 0;
  const height    = BAR_HEIGHT[size];
  const fillColor = BAR_FILL[variant];

  // Label text
  const leftLabel  = label ?? (max !== 100 ? `${safeValue} / ${max}` : null);
  const rightLabel = pct > 0 ? `${Math.round(pct)}%` : null;

  return (
    <div className={className} style={{ width: '100%' }}>
      {/* Optional label row */}
      {showLabel && (leftLabel || rightLabel) && (
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            marginBottom:   6,
          }}
        >
          {leftLabel && (
            <span
              style={{
                fontSize:    11,
                fontFamily:  'var(--font-mono)',
                color:       'var(--color-muted)',
                lineHeight:  1,
              }}
            >
              {leftLabel}
            </span>
          )}
          {rightLabel && (
            <span
              style={{
                fontSize:    11,
                fontFamily:  'var(--font-mono)',
                color:       fillColor,
                lineHeight:  1,
              }}
            >
              {rightLabel}
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? 'Progress'}
        style={{
          position:     'relative',
          width:        '100%',
          height:       height,
          borderRadius: 9999,
          backgroundColor: 'var(--input-bg)',
          overflow:     'hidden',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position:        'absolute',
            inset:           0,
            right:           'auto',               // let width control the fill
            width:           `${pct}%`,
            borderRadius:    9999,
            backgroundColor: fillColor,
            transition:      animated
              ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              : undefined,
            // Subtle shimmer on larger bars to suggest activity
            ...(size === 'lg' || size === 'md'
              ? {
                  backgroundImage: `linear-gradient(
                    90deg,
                    ${fillColor} 0%,
                    color-mix(in srgb, ${fillColor} 80%, white) 50%,
                    ${fillColor} 100%
                  )`,
                }
              : {}),
          }}
        />
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// StepDots
// ═════════════════════════════════════════════════════════════════════════════

export interface StepDotsProps {
  /** Total number of steps. */
  total: number;
  /**
   * Zero-indexed current step.
   * - Past steps (< current): filled, muted
   * - Current step: expands into a capsule, accent colour
   * - Future steps (> current): empty gray ring
   */
  current: number;
  /** Dot diameter in px. Default: 8. */
  dotSize?: number;
  /** Gap between dots in px. Default: 6. */
  gap?: number;
  /** aria-label for the container. */
  'aria-label'?: string;
  className?: string;
}

export function StepDots({
  total,
  current,
  dotSize = 8,
  gap = 6,
  'aria-label': ariaLabel,
  className = '',
}: StepDotsProps) {
  // Clamp to valid range
  const idx = Math.max(0, Math.min(current, total - 1));

  // Active capsule width = 2× dotSize
  const capsuleWidth = dotSize * 2;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel ?? `Step ${idx + 1} of ${total}`}
      className={className}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            gap,
        padding:        '4px 0',
      }}
    >
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === idx;
        const isPast   = i < idx;
        // future: i > idx

        return (
          <div
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={`Step ${i + 1}`}
            style={{
              // Shape: active expands to a capsule, others stay circular
              width:  isActive ? capsuleWidth : dotSize,
              height: dotSize,
              borderRadius: 9999,

              // Colour
              backgroundColor: isActive
                ? 'var(--color-accent)'
                : isPast
                ? 'color-mix(in srgb, var(--color-accent) 30%, transparent)'
                : 'var(--input-bg)',

              border: (!isActive && !isPast)
                ? '1.5px solid var(--surface-divider)'
                : 'none',

              // Spring-like transition — width + background together
              transition: [
                'width 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'background-color 0.2s ease',
              ].join(', '),

              // Perf
              willChange: 'width',
              flexShrink: 0,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
