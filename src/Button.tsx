import type { ButtonProps } from './types';

const VARIANTS = {
  primary: 'bg-[var(--color-ink)] text-[var(--color-paper)] active:opacity-75',
  secondary: 'bg-[var(--input-bg)] text-[var(--color-ink)] active:bg-[var(--surface-divider)]',
  ghost: 'text-[var(--color-accent)] active:opacity-50',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        // 44px min touch target (Apple HIG)
        'min-h-[44px] px-5 rounded-xl font-semibold text-[15px]',
        'transition-all select-none',
        fullWidth ? 'w-full' : '',
        VARIANTS[variant],
        disabled ? 'opacity-40 pointer-events-none' : '',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
