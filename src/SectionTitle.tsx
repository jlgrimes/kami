import type { SectionTitleProps } from './types';

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <p className={`text-xs font-mono text-gray-400 uppercase tracking-widest px-4 pt-6 pb-2 ${className}`}>
      {children}
    </p>
  );
}
