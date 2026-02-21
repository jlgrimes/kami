import type { ReactNode } from 'react';

// ── Existing components ───────────────────────────────────────────────────────

export interface PageProps {
  children: ReactNode;
  className?: string;
}

export interface NavbarProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export interface ListItemProps {
  title: string;
  subtitle?: string;
  media?: ReactNode;
  after?: ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

// ── New components (QRT-192) ──────────────────────────────────────────────────

/** InputProps — iOS-native filled text input */
export interface InputProps {
  /** Floating label shown above the input */
  label?: string;
  /** Helper text shown below (muted) */
  helper?: string;
  /** Error message — replaces helper text, turns ring red */
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Show a clear (✕) button when the field has a value */
  clearable?: boolean;
  /** Optional icon/emoji shown on the left */
  leadingIcon?: ReactNode;
  className?: string;
}

/** BadgeProps — compact status / count indicator */
export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

/** ChipProps — selectable filter tag */
export interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: (next: boolean) => void;
  disabled?: boolean;
  /** Optional leading icon/emoji */
  icon?: string;
  className?: string;
}
