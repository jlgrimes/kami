// ── Navigation + layout ───────────────────────────────────────────────────────
export { NavigationStack, useNavigation } from './NavigationStack';
export type { NavigationHandle } from './NavigationStack';
export { TabBar } from './TabBar';
export { Page, PageContent, useScrollToTop } from './Page';
export { Navbar } from './Navbar';

// ── Core components ───────────────────────────────────────────────────────────
export { Card } from './Card';
export { Button } from './Button';
export { List, ListItem } from './List';
export { SectionTitle } from './SectionTitle';
export { Skeleton } from './Skeleton';
export { ErrorBoundary, ErrorState } from './ErrorBoundary';
export { ToastProvider, useToast } from './Toast';
export type { ToastVariant, ToastPosition, ToastOptions } from './Toast';
export { BottomSheet } from './BottomSheet';
export { ActionSheet } from './ActionSheet';
export type { ActionSheetAction } from './ActionSheet';
export {
  spring, animate, pageTransition, useAnimation,
  springs, Presets, fadeInFrames, fadeOutFrames, slideFrames,
} from './animations';
export type { SpringConfig, SpringResult, AnimationPreset, TransitionType, Keyframes } from './animations';

// ── New: QRT-192 ──────────────────────────────────────────────────────────────
export { Input } from './Input';
export { Badge } from './Badge';
export { Chip, ChipGroup } from './Chip';

// ── New: QRT-197 ──────────────────────────────────────────────────────────────
export { SegmentedControl } from './SegmentedControl';
export type { SegmentedControlProps, SegmentOption } from './SegmentedControl';

// ── New: QRT-198 ──────────────────────────────────────────────────────────────
export { ProgressBar, StepDots } from './Progress';
export type {
  ProgressBarProps,
  ProgressBarSize,
  ProgressBarVariant,
  StepDotsProps,
} from './Progress';

// ── Dev tools — import directly, not via barrel, to keep prod bundle clean ────
// import { ComponentCatalog } from './ComponentCatalog'; // use in app conditionally

// ── Design tokens (QRT-191) ───────────────────────────────────────────────────
export { tokens, color, surface, text, font, space, radius, shadow, ring, duration, ease, transition, z, touchTarget } from './tokens';

// ── Prop types ────────────────────────────────────────────────────────────────
export type {
  PageProps,
  NavbarProps,
  CardProps,
  ButtonProps,
  ListItemProps,
  SectionTitleProps,
  InputProps,
  BadgeProps,
  ChipProps,
} from './types';
