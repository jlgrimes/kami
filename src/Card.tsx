import type { CardProps } from './types';

export function Card({ children, className = '', onClick }: CardProps) {
  const interactive = !!onClick;
  return (
    <div
      onClick={onClick}
      className={[
        'bg-[var(--surface-solid)] rounded-2xl border border-[var(--surface-border)] shadow-sm p-5',
        interactive
          ? 'cursor-pointer active:scale-[0.98] active:shadow-none active:bg-[var(--surface-active)] transition-all select-none'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
