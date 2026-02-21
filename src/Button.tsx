import type { ButtonProps } from './types';
import { ActivityIndicator } from './ActivityIndicator';

const VARIANTS = {
  primary: 'bg-[var(--color-ink)] text-[var(--color-paper)] active:opacity-75',
  secondary: 'bg-[var(--input-bg)] text-[var(--color-ink)] active:bg-[var(--surface-divider)]',
  ghost: 'text-[var(--color-accent)] active:opacity-50',
};

/** Spinner colours per variant — keeps contrast on each background. */
const SPINNER_COLOR: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'var(--color-paper)',
  secondary: 'var(--color-ink)',
  ghost:     'var(--color-accent)',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  type = 'button',
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-busy={loading || undefined}
      className={[
        // 44px min touch target (Apple HIG)
        'min-h-[44px] px-5 rounded-xl font-semibold text-[15px]',
        'transition-all select-none',
        // Use relative + flex to position spinner without layout shift
        'relative flex items-center justify-center gap-2',
        fullWidth ? 'w-full' : '',
        VARIANTS[variant],
        isDisabled ? 'opacity-40 pointer-events-none' : '',
        className,
      ].join(' ')}
    >
      {loading && (
        <ActivityIndicator
          size="sm"
          color={SPINNER_COLOR[variant]}
          aria-label="Loading"
        />
      )}
      {/* Children are always rendered (keeps button width stable when loading) */}
      <span className={loading ? 'opacity-0 select-none pointer-events-none absolute' : ''}>
        {children}
      </span>
    </button>
  );
}
