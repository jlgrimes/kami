import type { BadgeProps } from './types';

/**
 * Badge — compact status / count indicator.
 *
 * Variants: default | primary | success | warning | danger | muted
 * Sizes:    sm | md
 *
 * Fully token-driven. No dependencies.
 */

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';
type BadgeSize    = 'sm' | 'md';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-[var(--surface-solid-hover)] text-[var(--color-ink)]  border border-[var(--surface-divider)]',
  primary: 'bg-[var(--color-accent)]         text-white',
  success: 'bg-[var(--surface-success)]      text-[var(--color-success)]',
  warning: 'bg-[var(--surface-warning)]      text-[#7a5c00]',
  danger:  'bg-[var(--surface-danger)]       text-[var(--color-danger)]',
  muted:   'bg-[var(--input-bg)]             text-[var(--color-muted)]',
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-px  font-bold tracking-wide leading-none',
  md: 'text-[12px] px-2   py-0.5 font-semibold leading-none',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-full select-none whitespace-nowrap',
        VARIANT_CLASSES[variant as BadgeVariant],
        SIZE_CLASSES[size as BadgeSize],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
