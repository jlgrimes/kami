import React, { useId } from 'react';

/**
 * SegmentedControl — iOS-native UISegmentedControl equivalent.
 *
 * Features:
 *   - Equal-width segments, spring-animated sliding pill indicator
 *   - Text + optional icon/emoji labels
 *   - 2–6 segments supported
 *   - Design token driven — zero hard-coded colors
 *   - Accessible: role=tablist / role=tab, keyboard navigation
 *   - Capacitor / WKWebView safe (no ResizeObserver, no CSS :has())
 *   - Zero external dependencies
 *
 * Usage:
 * ```tsx
 * const [tab, setTab] = useState('all');
 *
 * <SegmentedControl
 *   options={[
 *     { value: 'all',   label: 'All' },
 *     { value: 'quiz',  label: 'Quiz', icon: '🎌' },
 *     { value: 'saved', label: 'Saved' },
 *   ]}
 *   value={tab}
 *   onChange={setTab}
 * />
 * ```
 */

export interface SegmentOption<T extends string = string> {
  value: T;
  /** Short label — keep ≤ 10 chars for 3+ segments. */
  label: string;
  /** Optional leading icon or emoji. */
  icon?: string;
  /** Prevents selection. */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Visual size preset. Default: 'md'. */
  size?: 'sm' | 'md';
  /** Full-width container. Default: true. */
  fullWidth?: boolean;
  className?: string;
  /** aria-label for the tablist container. */
  'aria-label'?: string;
}

// ── Spring-like ease (mimics iOS UISegmentedControl feel) ─────────────────────
// cubic-bezier(0.34, 1.56, 0.64, 1) — gentle overshoot, fast settle
const SPRING_EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const SPRING_DURATION = '0.32s';

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = true,
  className = '',
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  const id = useId();
  const n = options.length;
  const selectedIndex = Math.max(0, options.findIndex(o => o.value === value));

  // ── Sizing ─────────────────────────────────────────────────────────────────
  const trackHeight  = size === 'sm' ? '30px' : '36px';
  const textSize     = size === 'sm' ? '12px' : '13px';
  const fontWeight   = '500'; // SF Pro medium weight

  // ── Pill geometry ──────────────────────────────────────────────────────────
  // The track has 2px padding on all sides; the pill fills one 1/N-th slot.
  // We use `left` for position so the spring eases purely in one axis.
  const TRACK_PAD = 2; // px — inner inset on all sides

  // pill width = (100% of track - 2*pad) / N - we compute as fractional %:
  // actual pixel width = (containerPx - 2*TRACK_PAD) / N
  // We express this purely in % so no JS measurement is needed.
  const pillarWidthPct = `calc((100% - ${TRACK_PAD * 2}px) / ${n})`;

  // pill left = TRACK_PAD + index * (1/n of container-2pad)
  const pillLeftValue = `calc(${TRACK_PAD}px + ${selectedIndex} * (100% - ${TRACK_PAD * 2}px) / ${n})`;

  // ── Keyboard handler ───────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabledIndices = options
      .map((o, i) => ({ o, i }))
      .filter(({ o }) => !o.disabled)
      .map(({ i }) => i);

    const currentEnabledPos = enabledIndices.indexOf(selectedIndex);
    let nextEnabledPos: number | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextEnabledPos = (currentEnabledPos + 1) % enabledIndices.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextEnabledPos =
        (currentEnabledPos - 1 + enabledIndices.length) % enabledIndices.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextEnabledPos = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextEnabledPos = enabledIndices.length - 1;
    }

    if (nextEnabledPos !== null) {
      const nextIdx = enabledIndices[nextEnabledPos];
      onChange(options[nextIdx].value);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel ?? 'Segmented control'}
      onKeyDown={handleKeyDown}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
        height: trackHeight,
        backgroundColor: 'var(--input-bg)',
        borderRadius: 'var(--radius-sm)',        // 10px — matches iOS
        padding: `${TRACK_PAD}px`,
        boxSizing: 'border-box',
        // subtle inner shadow like iOS
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
      }}
    >
      {/* ── Sliding pill ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: `${TRACK_PAD}px`,
          left: pillLeftValue,
          width: pillarWidthPct,
          bottom: `${TRACK_PAD}px`,
          borderRadius: `calc(var(--radius-sm) - ${TRACK_PAD}px)`,  // inset radius
          backgroundColor: 'var(--surface-solid)',
          boxShadow: 'var(--shadow-xs)',
          transition: `left ${SPRING_DURATION} ${SPRING_EASE}`,
          pointerEvents: 'none',
          willChange: 'left',
        }}
      />

      {/* ── Segment buttons ───────────────────────────────────────────────── */}
      {options.map((opt, i) => {
        const isSelected = i === selectedIndex;
        const isDisabled = opt.disabled === true;
        const tabId = `${id}-tab-${opt.value}`;

        return (
          <button
            key={opt.value}
            id={tabId}
            role="tab"
            type="button"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
            tabIndex={isSelected ? 0 : -1}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(opt.value)}
            style={{
              // layout
              flex: 1,
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '0 4px',
              minWidth: 0,
              // typography
              fontSize: textSize,
              fontWeight,
              fontFamily: 'var(--font-sans)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              userSelect: 'none',
              // color — transitions smoothly with the pill
              color: isSelected
                ? 'var(--color-ink)'
                : 'var(--color-muted)',
              opacity: isDisabled ? 0.38 : 1,
              // transitions
              transition: `color ${SPRING_DURATION} ${SPRING_EASE}, opacity 150ms ease`,
              // reset button defaults
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              WebkitTapHighlightColor: 'transparent',
              borderRadius: `calc(var(--radius-sm) - ${TRACK_PAD}px)`,
            } as React.CSSProperties}
          >
            {opt.icon && (
              <span
                style={{
                  fontSize: size === 'sm' ? '11px' : '13px',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {opt.icon}
              </span>
            )}
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
