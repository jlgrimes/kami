/**
 * Select — iOS-native picker that opens a BottomSheet with a scrollable
 * option list. Replaces native HTML <select> on mobile.
 *
 * Variants:
 *   Single select (default) — tapping an option selects it and closes the sheet.
 *   Multi select            — tapping toggles; a Done button confirms.
 *   Searchable              — adds a SearchBar at the top of the sheet.
 *
 * Props API:
 * ```tsx
 * // Single
 * <Select
 *   options={[
 *     { value: 'en', label: 'English', icon: '🇺🇸' },
 *     { value: 'ja', label: 'Japanese', icon: '🇯🇵' },
 *   ]}
 *   value="en"
 *   onChange={v => setLang(v)}
 *   label="Language"
 *   searchable
 * />
 *
 * // Multi
 * <Select
 *   options={[...]}
 *   value={['en', 'ja']}
 *   onChange={vs => setLangs(vs)}
 *   multi
 *   label="Languages"
 * />
 * ```
 */

import { useMemo, useRef, useState, type ReactNode } from 'react';
import { BottomSheet } from './BottomSheet';
import { hapticLight, hapticSelection } from './haptics';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  /** Optional leading emoji or icon character */
  icon?: string;
  /** Secondary label */
  sublabel?: string;
  disabled?: boolean;
}

interface SelectBaseProps<T extends string = string> {
  options: SelectOption<T>[];
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** Floating label above the trigger */
  label?: string;
  /** BottomSheet header title — defaults to `label ?? placeholder ?? 'Select'` */
  title?: string;
  /** Show a SearchBar inside the BottomSheet to filter options */
  searchable?: boolean;
  disabled?: boolean;
  /** Text on the "Done" button for multi-select. Default: 'Done' */
  doneLabel?: string;
  /** Allow clearing the selection. Single: shows ✕ in trigger. Multi: not applicable (use deselect). */
  clearable?: boolean;
  className?: string;
  'aria-label'?: string;
}

export interface SelectSingleProps<T extends string = string> extends SelectBaseProps<T> {
  multi?: false;
  value: T | null;
  onChange: (value: T) => void;
  onClear?: () => void;
}

export interface SelectMultiProps<T extends string = string> extends SelectBaseProps<T> {
  multi: true;
  value: T[];
  onChange: (values: T[]) => void;
}

export type SelectProps<T extends string = string> =
  | SelectSingleProps<T>
  | SelectMultiProps<T>;

// ── Chevron SVG ───────────────────────────────────────────────────────────────

function ChevronDown() {
  return (
    <svg
      width="14" height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── Checkmark SVG ─────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="17" height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Option row ────────────────────────────────────────────────────────────────

interface OptionRowProps {
  option: SelectOption;
  selected: boolean;
  multi: boolean;
  onPress: () => void;
}

function OptionRow({ option, selected, multi, onPress }: OptionRowProps) {
  return (
    <button
      type="button"
      disabled={option.disabled}
      onClick={onPress}
      className={[
        'w-full flex items-center gap-3 px-4 py-3.5 min-h-[50px]',
        'text-left select-none transition-colors duration-100',
        'active:bg-[var(--surface-active)]',
        option.disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer',
        // Show a top divider for all but the first row
      ].join(' ')}
      style={{ borderTop: '1px solid var(--surface-divider)' }}
    >
      {/* Leading: icon or multi-select checkbox */}
      {multi ? (
        <div
          style={{
            width: 22, height: 22, flexShrink: 0,
            borderRadius: 6,
            border: selected
              ? '2px solid var(--color-accent)'
              : '2px solid var(--surface-divider)',
            background: selected ? 'var(--color-accent)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s ease, border-color 0.15s ease',
          }}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      ) : option.icon ? (
        <span className="text-[20px] leading-none shrink-0">{option.icon}</span>
      ) : null}

      {/* Labels */}
      <div className="flex-1 min-w-0">
        <p className={[
          'text-[15px] leading-snug',
          selected && !multi
            ? 'font-semibold text-[var(--color-ink)]'
            : 'font-medium text-[var(--color-ink)]',
        ].join(' ')}>
          {option.label}
        </p>
        {option.sublabel && (
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5 leading-snug">
            {option.sublabel}
          </p>
        )}
      </div>

      {/* Trailing: single-select checkmark */}
      {!multi && selected && (
        <span className="shrink-0 text-[var(--color-accent)]">
          <CheckIcon />
        </span>
      )}
    </button>
  );
}

// ── Trigger button ────────────────────────────────────────────────────────────

interface TriggerProps {
  label?: string;
  displayValue: ReactNode;
  hasValue: boolean;
  disabled?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  onClick: () => void;
  ariaLabel?: string;
}

function Trigger({ label, displayValue, hasValue, disabled, clearable, onClear, onClick, ariaLabel }: TriggerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[13px] font-medium text-[var(--color-ink)] px-1">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        className={[
          'flex items-center gap-2 px-3 min-h-[44px] rounded-xl w-full text-left',
          'bg-[var(--input-bg)] transition-shadow duration-150',
          'active:shadow-[0_0_0_2.5px_rgba(67,97,238,0.22)]',
          disabled ? 'opacity-40 pointer-events-none' : '',
        ].join(' ')}
      >
        <span className={[
          'flex-1 text-[15px] truncate',
          hasValue ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]',
        ].join(' ')}>
          {displayValue}
        </span>

        {/* Clear button */}
        {clearable && hasValue && onClear && (
          <button
            type="button"
            onPointerDown={e => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }}
            className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-muted)] opacity-60 active:opacity-40 transition-opacity"
            aria-label="Clear selection"
          >
            <span className="text-white font-bold leading-none" style={{ fontSize: 10 }}>✕</span>
          </button>
        )}

        <span className="shrink-0 text-[var(--color-muted)]">
          <ChevronDown />
        </span>
      </button>
    </div>
  );
}

// ── Inline search input (avoids importing SearchBar to keep bundle trim) ──────

interface InlineSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function InlineSearch({ value, onChange, placeholder = 'Search…' }: InlineSearchProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="px-4 pb-3 pt-1">
      <div
        className="flex items-center gap-2 px-3 bg-[var(--input-bg)] rounded-full"
        style={{ height: 36 }}
        onClick={() => ref.current?.focus()}
      >
        {/* Magnifier */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-[var(--color-muted)] shrink-0" aria-hidden="true">
          <circle cx="11" cy="11" r="7.5" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
        <input
          ref={ref}
          type="search"
          inputMode="search"
          autoCapitalize="none"
          autoCorrect="off"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            'flex-1 min-w-0 bg-transparent outline-none',
            'text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]',
            '[&::-webkit-search-cancel-button]:hidden',
            '[&::-webkit-search-decoration]:hidden',
          ].join(' ')}
        />
        {value && (
          <button
            type="button"
            onPointerDown={e => { e.preventDefault(); onChange(''); }}
            className="shrink-0 flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[var(--color-muted)] opacity-50 active:opacity-30"
            aria-label="Clear search"
          >
            <span className="text-white font-bold leading-none" style={{ fontSize: 9 }}>✕</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function Select<T extends string = string>(props: SelectProps<T>) {
  const {
    options,
    placeholder = 'Select…',
    label,
    title,
    searchable = false,
    disabled = false,
    doneLabel = 'Done',
    clearable = false,
    className = '',
    'aria-label': ariaLabel,
  } = props;

  const [open,        setOpen]        = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sheetTitle = title ?? label ?? placeholder;

  // ── Derived display values ──────────────────────────────────────────────────

  const selectedOptions = useMemo(() => {
    if (props.multi) {
      return options.filter(o => (props.value as T[]).includes(o.value));
    }
    return options.filter(o => o.value === props.value);
  }, [options, props.multi ? props.value : props.value]); // eslint-disable-line

  const displayValue = useMemo(() => {
    if (selectedOptions.length === 0) return placeholder;
    if (props.multi) {
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions[0].label} +${selectedOptions.length - 1} more`;
    }
    const opt = selectedOptions[0];
    return opt.icon ? `${opt.icon}  ${opt.label}` : opt.label;
  }, [selectedOptions, placeholder, props.multi]);

  const hasValue = selectedOptions.length > 0;

  // ── Filtered options ────────────────────────────────────────────────────────

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(o =>
      o.label.toLowerCase().includes(q) ||
      (o.sublabel?.toLowerCase().includes(q) ?? false),
    );
  }, [options, searchQuery]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openSheet = () => {
    if (disabled) return;
    hapticLight();
    setSearchQuery('');
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
    setSearchQuery('');
  };

  const handleSingleSelect = (value: T) => {
    if (props.multi) return; // type guard
    hapticSelection();
    (props as SelectSingleProps<T>).onChange(value);
    setTimeout(closeSheet, 100); // brief delay so press state is visible
  };

  const handleMultiToggle = (value: T) => {
    if (!props.multi) return;
    hapticSelection();
    const current = props.value as T[];
    const next    = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    (props as SelectMultiProps<T>).onChange(next);
  };

  const handleClear = () => {
    if (!props.multi) {
      (props as SelectSingleProps<T>).onClear?.();
    }
  };

  // ── Empty search result ─────────────────────────────────────────────────────
  const emptySearch = searchQuery.trim() && filteredOptions.length === 0;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={className}>
      <Trigger
        label={label}
        displayValue={displayValue}
        hasValue={hasValue}
        disabled={disabled}
        clearable={clearable && !props.multi}
        onClear={handleClear}
        onClick={openSheet}
        ariaLabel={ariaLabel ?? label ?? placeholder}
      />

      <BottomSheet open={open} onClose={closeSheet} title={sheetTitle}>
        {/* Search bar */}
        {searchable && (
          <InlineSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${sheetTitle.toLowerCase()}…`}
          />
        )}

        {/* Option list */}
        <div
          role="listbox"
          aria-label={sheetTitle}
          aria-multiselectable={props.multi}
        >
          {emptySearch ? (
            <div className="py-10 flex flex-col items-center gap-2">
              <p className="text-[34px] leading-none">🔍</p>
              <p className="text-[15px] text-[var(--color-muted)]">
                No results for &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          ) : (
            filteredOptions.map(opt => {
              const isSelected = props.multi
                ? (props.value as T[]).includes(opt.value as T)
                : props.value === opt.value;

              return (
                <OptionRow
                  key={opt.value}
                  option={opt as SelectOption}
                  selected={isSelected}
                  multi={Boolean(props.multi)}
                  onPress={() =>
                    props.multi
                      ? handleMultiToggle(opt.value as T)
                      : handleSingleSelect(opt.value as T)
                  }
                />
              );
            })
          )}
        </div>

        {/* Multi-select Done button */}
        {props.multi && (
          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={closeSheet}
              className={[
                'w-full bg-[var(--color-ink)] text-[var(--color-paper)]',
                'rounded-xl py-3.5 text-[15px] font-semibold',
                'active:opacity-75 transition-opacity',
              ].join(' ')}
            >
              {doneLabel}
              {(props.value as T[]).length > 0 && (
                <span className="opacity-60 font-normal">
                  {' '}· {(props.value as T[]).length} selected
                </span>
              )}
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
