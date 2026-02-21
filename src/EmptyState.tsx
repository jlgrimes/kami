/**
 * EmptyState — zero-content placeholder.
 *
 * Two layouts:
 *   fullscreen (default) — vertically + horizontally centred in the page.
 *   contained            — centred in its parent container (no fixed height).
 *
 * Anatomy:
 *   [illustration / icon]
 *   [title]
 *   [subtitle]
 *   [action button | custom action node]
 *
 * Usage:
 * ```tsx
 * // Simple
 * <EmptyState
 *   icon="📭"
 *   title="Nothing saved yet"
 *   subtitle="Tap the bookmark icon on any phrase to save it here."
 *   action={{ label: 'Browse lessons', onPress: () => push(<Home />) }}
 * />
 *
 * // Error variant
 * <EmptyState
 *   icon="⚠️"
 *   title="Something went wrong"
 *   subtitle={err.message}
 *   action={{ label: 'Try again', onPress: retry }}
 *   variant="error"
 * />
 *
 * // Contained in a list column
 * <EmptyState
 *   icon="🔍"
 *   title="No results"
 *   subtitle={`No matches for "${query}"`}
 *   contained
 * />
 * ```
 */

import type { ReactNode } from 'react';
import { hapticLight } from './haptics';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  /** Button colour variant. Default: 'primary'. */
  variant?: 'primary' | 'ghost';
}

export type EmptyStateVariant = 'default' | 'error' | 'offline' | 'search';

export interface EmptyStateProps {
  /**
   * Illustration or emoji shown at the top.
   * Pass an emoji string (auto-sized) or a ReactNode for custom illustrations.
   */
  icon?: string | ReactNode;
  title: string;
  subtitle?: string;
  /** Primary CTA button, or pass a ReactNode for full control. */
  action?: EmptyStateAction | ReactNode;
  /**
   * Visual variant — sets a sensible default icon if `icon` is omitted.
   * Default: 'default'.
   */
  variant?: EmptyStateVariant;
  /**
   * Contained mode: no fixed height, centres in parent, smaller padding.
   * Use inside lists, cards, or search panels.
   * Default: false (full-screen centred).
   */
  contained?: boolean;
  className?: string;
}

// ── Default icons per variant ─────────────────────────────────────────────────

const VARIANT_ICON: Record<EmptyStateVariant, string> = {
  default: '📭',
  error:   '⚠️',
  offline: '📡',
  search:  '🔍',
};

// ── Action button ─────────────────────────────────────────────────────────────

function ActionButton({ label, onPress, variant = 'primary' }: EmptyStateAction) {
  const handlePress = () => {
    hapticLight();
    onPress();
  };

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={handlePress}
        style={{
          background:   'transparent',
          border:       'none',
          color:        'var(--color-accent)',
          fontSize:     17,
          fontWeight:   500,
          padding:      '10px 20px',
          minHeight:    44,
          cursor:       'pointer',
          borderRadius: 12,
          transition:   'opacity 0.12s ease',
        }}
        onPointerDown={e => (e.currentTarget.style.opacity = '0.5')}
        onPointerUp={e =>   (e.currentTarget.style.opacity = '1')}
        onPointerLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePress}
      style={{
        background:   'var(--color-ink)',
        border:       'none',
        color:        'white',
        fontSize:     15,
        fontWeight:   600,
        padding:      '0 24px',
        height:       44,
        minWidth:     120,
        cursor:       'pointer',
        borderRadius: 12,
        transition:   'opacity 0.12s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={e => (e.currentTarget.style.opacity = '0.7')}
      onPointerUp={e =>   (e.currentTarget.style.opacity = '1')}
      onPointerLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
  variant = 'default',
  contained = false,
  className = '',
}: EmptyStateProps) {
  const resolvedIcon = icon !== undefined ? icon : VARIANT_ICON[variant];
  const isEmojiIcon  = typeof resolvedIcon === 'string';

  // Determine if action is an EmptyStateAction descriptor or raw ReactNode
  const isActionDescriptor = (
    action !== null &&
    action !== undefined &&
    typeof action === 'object' &&
    'label' in (action as object) &&
    'onPress' in (action as object)
  );

  return (
    <div
      className={className}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        textAlign:      'center',
        padding:        contained ? '32px 24px' : '48px 32px',
        // Full-screen: fill parent height; contained: let content determine height
        ...(contained ? {} : { flex: 1, minHeight: 280 }),
      }}
    >
      {/* Icon / illustration */}
      {resolvedIcon !== null && resolvedIcon !== undefined && (
        <div
          aria-hidden="true"
          style={{
            marginBottom: contained ? 16 : 20,
            fontSize:     contained ? 40 : 52,
            lineHeight:   1,
            // Slight entrance: no JS animation, keep it simple and safe
            opacity:      1,
          }}
        >
          {isEmojiIcon ? (
            <span role="img" aria-hidden="true" style={{ fontSize: 'inherit' }}>
              {resolvedIcon}
            </span>
          ) : (
            resolvedIcon
          )}
        </div>
      )}

      {/* Title */}
      <p
        style={{
          fontSize:     contained ? 17 : 20,
          fontWeight:   700,
          color:        variant === 'error' ? 'var(--color-danger)' : 'var(--color-ink)',
          lineHeight:   1.3,
          margin:       0,
          marginBottom: subtitle ? 6 : (action ? 20 : 0),
          maxWidth:     280,
        }}
      >
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontSize:     contained ? 14 : 15,
            fontWeight:   400,
            color:        'var(--color-muted)',
            lineHeight:   1.5,
            margin:       0,
            marginBottom: action ? (contained ? 20 : 28) : 0,
            maxWidth:     260,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Action */}
      {action && (
        <div style={{ marginTop: (!subtitle && action) ? (contained ? 20 : 24) : 0 }}>
          {isActionDescriptor
            ? <ActionButton {...(action as EmptyStateAction)} />
            : action as ReactNode}
        </div>
      )}
    </div>
  );
}
