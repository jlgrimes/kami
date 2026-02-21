/**
 * Switch — iOS UISwitch equivalent.
 *
 * Visual anatomy:
 *   [Label text]  [========O ] ← track + sliding thumb
 *
 * Features:
 * - Matches iOS UISwitch proportions: 51×31 px track, 27 px thumb
 * - Spring-physics thumb slide: cubic-bezier(0.34, 1.28, 0.64, 1) at 320ms
 * - Track colour transitions: success (on) ↔ input-bg (off)
 * - Haptic feedback on toggle (Capacitor; no-op on web)
 * - 44px minimum touch target (Apple HIG) via wrapper padding trick
 * - Keyboard accessible: role=switch, aria-checked, Space key
 * - Optional label — left-aligned, grows to fill available space
 * - `variant` prop for alternate accent colours
 *
 * Usage:
 * ```tsx
 * const [on, setOn] = useState(false);
 * <Switch checked={on} onChange={setOn} label="Enable notifications" />
 * ```
 */

import React from 'react';
import { hapticLight } from './haptics';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SwitchVariant = 'success' | 'accent' | 'primary';

export interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Optional text label rendered to the left of the switch. */
  label?: string;
  /** Sublabel below the main label (smaller, muted). */
  sublabel?: string;
  disabled?: boolean;
  variant?: SwitchVariant;
  /** aria-label used when there's no visible label prop. */
  'aria-label'?: string;
  className?: string;
}

// ── Dimensions (iOS UISwitch canonical) ───────────────────────────────────────

const TRACK_W  = 51;   // px
const TRACK_H  = 31;   // px
const THUMB_D  = 27;   // diameter
const THUMB_INSET = 2; // px from track edge (top + side)
const THUMB_TRAVEL = TRACK_W - THUMB_D - THUMB_INSET * 2; // 51-27-4 = 20px

// ── Variant colour map ────────────────────────────────────────────────────────

const TRACK_ON: Record<SwitchVariant, string> = {
  success: 'var(--color-success)',
  accent:  'var(--color-accent)',
  primary: 'var(--color-ink)',
};

// ── Spring ease ───────────────────────────────────────────────────────────────
// Matches iOS UISwitch feel: fast snap with slight overshoot.
const SPRING_EASE     = 'cubic-bezier(0.34, 1.28, 0.64, 1)';
const SPRING_DURATION = '320ms';

// ── Component ─────────────────────────────────────────────────────────────────

export function Switch({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  variant = 'success',
  'aria-label': ariaLabel,
  className = '',
}: SwitchProps) {

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggle = () => {
    if (disabled) return;
    hapticLight();
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  // ── Track + thumb inline styles ──────────────────────────────────────────────
  const trackStyle: React.CSSProperties = {
    position:        'relative',
    width:           TRACK_W,
    minWidth:        TRACK_W,  // prevent flex shrink
    height:          TRACK_H,
    borderRadius:    TRACK_H / 2,
    backgroundColor: checked ? TRACK_ON[variant] : 'var(--input-bg)',
    // Inset shadow gives the recessed track look iOS uses
    boxShadow:       checked
      ? 'none'
      : 'inset 0 0 0 1.5px var(--surface-divider)',
    transition: [
      `background-color ${SPRING_DURATION} ${SPRING_EASE}`,
      `box-shadow        ${SPRING_DURATION} ${SPRING_EASE}`,
    ].join(', '),
    cursor:          disabled ? 'not-allowed' : 'pointer',
    opacity:         disabled ? 0.4 : 1,
    flexShrink:      0,
  };

  const thumbStyle: React.CSSProperties = {
    position:        'absolute',
    top:             THUMB_INSET,
    left:            THUMB_INSET,
    width:           THUMB_D,
    height:          THUMB_D,
    borderRadius:    THUMB_D / 2,
    backgroundColor: '#ffffff',
    boxShadow:       '0 2px 6px rgba(0,0,0,0.22), 0 0.5px 2px rgba(0,0,0,0.14)',
    transform:       checked
      ? `translateX(${THUMB_TRAVEL}px)`
      : 'translateX(0px)',
    transition:      `transform ${SPRING_DURATION} ${SPRING_EASE}`,
    willChange:      'transform',
    pointerEvents:   'none',
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  // If there's a label, the whole row is clickable and the track is the visual indicator.
  // If no label, the track itself is the interactive element.
  const hasLabel = Boolean(label || sublabel);

  const switchControl = (
    <div
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-label={!hasLabel ? (ariaLabel ?? 'Toggle') : undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      style={trackStyle}
      onClick={hasLabel ? undefined : toggle}
    >
      <div style={thumbStyle} />
    </div>
  );

  if (!hasLabel) {
    return (
      <div
        className={className}
        style={{
          display:  'inline-flex',
          alignItems: 'center',
          // Extend touch target to 44px using padding — visually transparent
          padding: `${(44 - TRACK_H) / 2}px ${(44 - TRACK_W) / 2}px`,
          margin:  `-${(44 - TRACK_H) / 2}px -${(44 - TRACK_W) / 2}px`,
          cursor:  disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={toggle}
      >
        {switchControl}
      </div>
    );
  }

  // Label layout: [label column fills] [switch right-aligned]
  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onClick={toggle}
      className={className}
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        gap:             12,
        minHeight:       44,   // Apple HIG minimum touch target
        cursor:          disabled ? 'not-allowed' : 'pointer',
        opacity:         disabled ? 0.4 : 1,
        // Override cursor on the inner track when label is present
        userSelect:      'none',
        WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}
    >
      {/* Labels */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {label && (
          <p style={{
            fontSize:   15,
            fontWeight: 500,
            color:      'var(--color-ink)',
            lineHeight: 1.3,
            margin:     0,
          }}>
            {label}
          </p>
        )}
        {sublabel && (
          <p style={{
            fontSize:   13,
            color:      'var(--color-muted)',
            lineHeight: 1.3,
            margin:     '2px 0 0',
          }}>
            {sublabel}
          </p>
        )}
      </div>

      {/* Switch visual — pointer-events: none since parent handles clicks */}
      <div style={{ ...trackStyle, cursor: 'inherit' }}>
        <div style={thumbStyle} />
      </div>
    </div>
  );
}
