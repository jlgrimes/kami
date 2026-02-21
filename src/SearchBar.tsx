/**
 * SearchBar — iOS-native UISearchBar equivalent.
 *
 * Anatomy:
 *   [ 🔍  placeholder / value  [✕] ]  [ Cancel ]
 *
 * Features:
 * - Pill-shaped filled input (--radius-full, --input-bg)
 * - Magnifier icon (SVG, token-coloured)
 * - Clear (✕) button when value is non-empty
 * - Cancel button springs in from the right on focus, springs out on cancel
 * - Light haptic on focus (Capacitor), no-op on web
 * - Keyboard-aware: inputMode="search", enterKeyHint="search"
 * - Controlled — caller owns value/onChange
 * - Zero external dependencies
 *
 * Usage:
 * ```tsx
 * const [query, setQuery] = useState('');
 * const [active, setActive] = useState(false);
 *
 * <SearchBar
 *   value={query}
 *   onChange={setQuery}
 *   onFocus={() => setActive(true)}
 *   onCancel={() => { setQuery(''); setActive(false); }}
 *   placeholder="Search…"
 *   showCancel={active}
 * />
 * ```
 */

import { useRef, type KeyboardEvent } from 'react';
import { hapticLight } from './haptics';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Called when the Cancel button is tapped. Caller should clear value + hide Cancel. */
  onCancel?: () => void;
  /** Called when the input receives focus. */
  onFocus?: () => void;
  /** Called when the input loses focus. */
  onBlur?: () => void;
  /** Called when the user presses Enter / Go on the keyboard. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /**
   * Whether to show the Cancel button.
   * Typically: `showCancel={isFocused}` managed in the parent.
   * The cancel button springs in/out based on this flag.
   */
  showCancel?: boolean;
  /** Cancel button label. Default: "Cancel". */
  cancelLabel?: string;
  /** Disable the entire control. */
  disabled?: boolean;
  /** Auto-focus the input on mount (use sparingly). */
  autoFocus?: boolean;
  className?: string;
}

// ── Spring ease ───────────────────────────────────────────────────────────────
// Matches BottomSheet enter spring for a consistent system feel.
const SPRING_IN  = 'cubic-bezier(0.34, 1.28, 0.64, 1)';
const SPRING_OUT = 'cubic-bezier(0.4, 0, 0.6, 1)';

// ── Icons ─────────────────────────────────────────────────────────────────────

function MagnifierIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7.5" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SearchBar({
  value,
  onChange,
  onCancel,
  onFocus,
  onBlur,
  onSubmit,
  placeholder = 'Search',
  showCancel = false,
  cancelLabel = 'Cancel',
  disabled = false,
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value.length > 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFocus = () => {
    hapticLight();
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    onChange('');
    inputRef.current?.blur();
    onCancel?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.(value);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
    >
      {/* ── Search pill ────────────────────────────────────────────────────── */}
      <div
        className={[
          'flex items-center gap-1.5 px-3 flex-1 min-w-0',
          'bg-[var(--input-bg)] rounded-[var(--radius-full)]',
          'transition-shadow duration-150',
          showCancel
            ? 'focus-within:shadow-[0_0_0_2.5px_rgba(67,97,238,0.22)]'
            : '',
          disabled ? 'opacity-40 pointer-events-none' : '',
        ].join(' ')}
        style={{
          height: 36,          // iOS UISearchBar canonical height
          minHeight: 36,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Magnifier */}
        <span
          className="shrink-0 text-[var(--color-muted)] leading-none"
          style={{ marginTop: 1 }}  // optical alignment
        >
          <MagnifierIcon />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          autoFocus={autoFocus}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={[
            'flex-1 min-w-0 bg-transparent outline-none',
            'text-[15px] text-[var(--color-ink)]',
            'placeholder:text-[var(--color-muted)]',
            // Reset native search input chrome (✕ button on WebKit)
            '[&::-webkit-search-decoration]:hidden',
            '[&::-webkit-search-cancel-button]:hidden',
            '[&::-webkit-search-results-button]:hidden',
          ].join(' ')}
          aria-label={placeholder}
        />

        {/* Clear button — only when there's text */}
        {hasValue && (
          <button
            type="button"
            onPointerDown={e => {
              // Prevent input blur before clear fires
              e.preventDefault();
              handleClear();
            }}
            className={[
              'shrink-0 flex items-center justify-center',
              'w-[17px] h-[17px] rounded-full',
              'bg-[var(--color-muted)] opacity-50',
              'active:opacity-30 transition-opacity duration-100',
            ].join(' ')}
            aria-label="Clear search"
          >
            <span
              className="text-white font-bold leading-none select-none"
              style={{ fontSize: 10 }}
            >
              ✕
            </span>
          </button>
        )}
      </div>

      {/* ── Cancel button — spring in/out ───────────────────────────────────── */}
      <div
        aria-hidden={!showCancel}
        style={{
          // Spring-physics width transition: expand from 0 → auto
          // We drive it with max-width + opacity so the pill reflows naturally
          maxWidth: showCancel ? 80 : 0,
          opacity:  showCancel ? 1 : 0,
          overflow: 'hidden',
          transition: [
            `max-width 0.32s ${showCancel ? SPRING_IN : SPRING_OUT}`,
            `opacity   ${showCancel ? '0.2s 0.04s ease' : '0.15s ease'}`,
          ].join(', '),
          flexShrink: 0,
          whiteSpace: 'nowrap',
          // Pad left inside so text doesn't touch the pill edge
          paddingLeft: showCancel ? 0 : 0,
        }}
      >
        <button
          type="button"
          tabIndex={showCancel ? 0 : -1}
          onClick={handleCancel}
          className={[
            'text-[var(--color-accent)] font-medium text-[17px]',
            'min-h-[44px] min-w-[44px]',
            'flex items-center justify-center',
            'active:opacity-50 transition-opacity duration-100',
            'select-none whitespace-nowrap',
          ].join(' ')}
          style={{ paddingLeft: 4 }}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
