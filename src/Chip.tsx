import type React from 'react';
import type { ChipProps } from './types';

/**
 * Chip — selectable filter tag. Toggles between selected and unselected states.
 *
 * Use cases:
 *   - Filter rows (grammar type, JLPT level, etc.)
 *   - Multi-select tags
 *   - Topic selection
 *
 * Follows Apple HIG 44px touch target and spring-physics feel.
 */
export function Chip({
  label,
  selected = false,
  onToggle,
  disabled = false,
  icon,
  className = '',
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle?.(!selected)}
      disabled={disabled}
      className={[
        // layout + shape
        'inline-flex items-center gap-1.5 px-3.5 rounded-full select-none',
        'min-h-[34px]',                       // comfortable tap height under 44px rows
        'transition-all duration-150',
        // selected state
        selected
          ? 'bg-[var(--color-ink)] text-white shadow-[var(--shadow-xs)]'
          : 'bg-[var(--input-bg)] text-[var(--color-ink)] border border-[var(--surface-divider)]',
        // interaction
        disabled
          ? 'opacity-40 pointer-events-none'
          : 'active:scale-[0.94] active:opacity-80',
        className,
      ].join(' ')}
    >
      {icon && (
        <span className="text-[13px] leading-none">{icon}</span>
      )}
      <span className="text-[13px] font-medium leading-none whitespace-nowrap">
        {label}
      </span>
      {/* Checkmark appears when selected */}
      {selected && (
        <span className="text-[10px] leading-none opacity-70">✓</span>
      )}
    </button>
  );
}

/**
 * ChipGroup — convenience wrapper that renders a horizontally scrollable row
 * of chips. Handles single-select or multi-select modes.
 */
interface ChipGroupProps<T extends string> {
  options: Array<{ value: T; label: string; icon?: string }>;
  value: T | T[];           // single (T) or multi (T[]) select
  onChange: (value: T | T[]) => void;
  multi?: boolean;
  className?: string;
}

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  multi = false,
  className = '',
}: ChipGroupProps<T>) {
  const selected = Array.isArray(value) ? value : [value];

  const toggle = (v: T) => {
    if (multi) {
      const arr = selected as T[];
      const next = arr.includes(v)
        ? arr.filter(x => x !== v)
        : [...arr, v];
      (onChange as (v: T[]) => void)(next);
    } else {
      (onChange as (v: T) => void)(v);
    }
  };

  return (
    <div
      className={`flex gap-2 overflow-x-auto pb-1 ${className}`}
      style={{
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}
    >
      {options.map(opt => (
        <Chip
          key={opt.value}
          label={opt.label}
          icon={opt.icon}
          selected={selected.includes(opt.value)}
          onToggle={() => toggle(opt.value)}
        />
      ))}
    </div>
  );
}
