import type { ReactNode } from 'react';
import type { ListItemProps } from './types';

interface ListProps {
  children: ReactNode;
  className?: string;
  inset?: boolean;
}

export function List({ children, className = '', inset = false }: ListProps) {
  return (
    <div
      className={[
        'bg-[var(--surface-solid)] overflow-hidden',
        inset
          ? 'mx-4 rounded-2xl border border-[var(--surface-divider)] shadow-[var(--shadow-xs)]'
          : 'border-y border-[var(--surface-divider)]',
        className,
      ].join(' ')}
    >
      <div className="divide-y divide-[var(--surface-divider)]">
        {children}
      </div>
    </div>
  );
}

export function ListItem({
  title,
  subtitle,
  media,
  after,
  chevron = false,
  onClick,
  className = '',
}: ListItemProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={[
        'w-full text-left flex items-center gap-3 px-4 py-3',
        'min-h-[44px] select-none', // 44px Apple HIG touch target
        onClick ? 'active:bg-[var(--surface-active)] transition-colors cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {media && (
        <div className="shrink-0 flex items-center justify-center">
          {media}
        </div>
      )}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[15px] font-medium text-[var(--color-ink)] leading-snug">{title}</p>
        {subtitle && (
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5 leading-snug">{subtitle}</p>
        )}
      </div>
      {after && (
        <div className="shrink-0 text-[13px] text-[var(--color-muted)]">{after}</div>
      )}
      {chevron && (
        <span className="shrink-0 text-[var(--color-muted)] opacity-50 text-lg leading-none">›</span>
      )}
    </Tag>
  );
}
