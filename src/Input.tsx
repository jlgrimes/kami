import { useId, useRef, useState } from 'react';
import type { InputProps } from './types';

/**
 * Input — iOS-native filled text input.
 *
 * Anatomy:
 *   [label]
 *   [icon?] [value / placeholder] [clear? | eye?]
 *   [helper text / error]
 *
 * Follows Apple HIG:
 *   - 44px min touch height
 *   - Filled background (--input-bg) in resting state
 *   - Accent-colored focus ring (no border in rest)
 *   - Error state swaps ring/text to --color-danger
 *   - Clear button appears when value is non-empty (clearable=true)
 *   - Password toggle shows/hides value (type="password")
 */
export function Input({
  label,
  helper,
  error,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  clearable = false,
  leadingIcon,
  className = '',
}: InputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;
  const hasValue = value !== undefined && value !== '';
  const hasError = !!error;

  // Ring classes — applied to the wrapper, not the input itself
  const ringClass = hasError
    ? 'focus-within:shadow-[0_0_0_3px_rgba(230,57,70,0.28)]'
    : 'focus-within:shadow-[0_0_0_3px_rgba(67,97,238,0.24)]';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[var(--color-ink)] px-1"
        >
          {label}
        </label>
      )}

      {/* Input wrapper — carries the focus ring */}
      <div
        className={[
          'flex items-center gap-2 px-3 rounded-xl min-h-[44px]',
          'bg-[var(--input-bg)] transition-shadow duration-150',
          ringClass,
          hasError ? 'shadow-[0_0_0_1.5px_rgba(230,57,70,0.5)]' : '',
          disabled ? 'opacity-40 pointer-events-none' : '',
        ].join(' ')}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Leading icon */}
        {leadingIcon && (
          <span className="shrink-0 text-[var(--color-muted)] text-[17px] leading-none select-none">
            {leadingIcon}
          </span>
        )}

        {/* Native input */}
        <input
          ref={inputRef}
          id={id}
          type={resolvedType}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoCapitalize={type === 'email' || isPassword ? 'none' : undefined}
          autoCorrect={isPassword || type === 'email' ? 'off' : undefined}
          spellCheck={isPassword ? false : undefined}
          className={[
            'flex-1 min-w-0 bg-transparent outline-none select-text',
            'text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]',
            'leading-none py-3',
          ].join(' ')}
        />

        {/* Trailing: clear button (when clearable and has value) */}
        {clearable && hasValue && !isPassword && (
          <button
            type="button"
            onPointerDown={e => {
              // Prevent input blur before clear fires
              e.preventDefault();
              onChange?.('');
              inputRef.current?.focus();
            }}
            className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-muted)] opacity-60 active:opacity-40 transition-opacity"
            aria-label="Clear"
          >
            <span className="text-white text-[11px] font-bold leading-none select-none">✕</span>
          </button>
        )}

        {/* Trailing: password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onPointerDown={e => {
              e.preventDefault();
              setShowPassword(s => !s);
            }}
            className="shrink-0 text-[var(--color-muted)] text-[15px] leading-none min-w-[28px] min-h-[28px] flex items-center justify-center active:opacity-40 transition-opacity"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        )}
      </div>

      {/* Helper / error text */}
      {(helper || error) && (
        <p
          className={[
            'text-[12px] px-1 leading-snug',
            hasError
              ? 'text-[var(--color-danger)]'
              : 'text-[var(--color-muted)]',
          ].join(' ')}
        >
          {error ?? helper}
        </p>
      )}
    </div>
  );
}
