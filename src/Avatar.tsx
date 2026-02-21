/**
 * Avatar — user avatar with image + initials fallback.
 *
 * Features:
 * - Image with graceful fallback to initials on error or when no src
 * - Initials derived from `name` (up to 2 chars), coloured by consistent hash
 * - Sizes: xs (28) / sm (36) / md (44) / lg (56) / xl (80)
 * - Online indicator: green dot, bottom-right, white ring
 * - Pressable variant: scale press + haptic on tap
 * - Skeleton loading state: shimmer placeholder ring
 * - AvatarGroup: overlapping stack of avatars
 *
 * Usage:
 * ```tsx
 * <Avatar src="/users/jared.jpg" name="Jared Grimes" size="lg" online />
 * <Avatar name="山田 太郎" size="md" onClick={() => openProfile()} />
 * <Avatar loading size="md" />
 *
 * <AvatarGroup>
 *   <Avatar name="Alice" />
 *   <Avatar name="Bob" />
 *   <Avatar name="Charlie" />
 *   +2
 * </AvatarGroup>
 * ```
 */

import React, { useState, type ReactNode } from 'react';
import { hapticLight } from './haptics';

// ── Size map ──────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 80,
};

const FONT_PX: Record<AvatarSize, number> = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
};

const DOT_PX: Record<AvatarSize, number> = {
  xs:  8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 18,
};

const DOT_RING: Record<AvatarSize, number> = {
  xs: 1.5,
  sm: 2,
  md: 2.5,
  lg: 2.5,
  xl: 3,
};

// ── Initials colour palette (token-safe) ──────────────────────────────────────
// These colours are chosen to look good at all sizes with white initials.
// They cycle deterministically by name hash so the same name always maps
// to the same colour.

const INITIALS_COLORS = [
  '#4361ee', // subject blue
  '#2d6a4f', // success green
  '#e63946', // accent red
  '#e76f51', // object orange
  '#6d6875', // particle purple
  '#9b2226', // verb deep red
  '#457b9d', // calm blue
  '#2a9d8f', // teal
];

function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return INITIALS_COLORS[hash % INITIALS_COLORS.length];
}

function nameToInitials(name: string): string {
  if (!name.trim()) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  // Take first char of first + last word (handles middle names)
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AvatarProps {
  /** URL of the avatar image. Falls back to initials on error or omission. */
  src?: string;
  /** User's display name — used for initials + alt text. */
  name?: string;
  size?: AvatarSize;
  /** Show an online indicator dot (bottom-right). */
  online?: boolean;
  /** Skeleton shimmer loading state. */
  loading?: boolean;
  /** Makes the avatar pressable — scales on press, haptic feedback. */
  onClick?: () => void;
  /** Override alt text (defaults to name). */
  alt?: string;
  className?: string;
}

// ── Skeleton shimmer ──────────────────────────────────────────────────────────

function AvatarSkeleton({ size }: { size: AvatarSize }) {
  const px = SIZE_PX[size];
  return (
    <>
      <style>{`
        @keyframes kami-avatar-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          width:           px,
          height:          px,
          borderRadius:    '50%',
          backgroundImage: 'linear-gradient(90deg, var(--input-bg) 25%, var(--surface-divider) 50%, var(--input-bg) 75%)',
          backgroundSize:  '200% 100%',
          animation:       'kami-avatar-shimmer 1.4s ease-in-out infinite',
          flexShrink:      0,
        }}
      />
    </>
  );
}

// ── Main Avatar ───────────────────────────────────────────────────────────────

export function Avatar({
  src,
  name = '',
  size = 'md',
  online = false,
  loading = false,
  onClick,
  alt,
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const px       = SIZE_PX[size];
  const fontSize = FONT_PX[size];
  const dotSize  = DOT_PX[size];
  const dotRing  = DOT_RING[size];

  const showImage    = Boolean(src) && !imgError;
  const showInitials = !showImage;
  const initials     = nameToInitials(name);
  const bgColor      = nameToColor(name || '?');
  const altText      = alt ?? name ?? 'Avatar';
  const pressable    = Boolean(onClick);

  // ── Press handler ────────────────────────────────────────────────────────────
  const handlePress = () => {
    if (!onClick) return;
    hapticLight();
    onClick();
  };

  if (loading) {
    return (
      <div className={className} style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
        <AvatarSkeleton size={size} />
      </div>
    );
  }

  // ── Avatar circle ─────────────────────────────────────────────────────────────

  const circleStyle: React.CSSProperties = {
    width:        px,
    height:       px,
    borderRadius: '50%',
    overflow:     'hidden',
    flexShrink:   0,
    display:      'flex',
    alignItems:   'center',
    justifyContent: 'center',
    backgroundColor: showInitials ? bgColor : 'var(--input-bg)',
    position:     'relative',
    userSelect:   'none',
    transition:   pressable ? 'transform 0.12s ease, opacity 0.12s ease' : undefined,
    cursor:       pressable ? 'pointer' : 'default',
    WebkitTapHighlightColor: 'transparent',
  };

  const Circle = pressable ? (
    <button
      type="button"
      onClick={handlePress}
      aria-label={altText}
      style={{
        ...circleStyle,
        padding: 0,
        border: 'none',
        outline: 'none',
      }}
      className={[
        pressable ? 'active:scale-[0.90] active:opacity-80' : '',
        className,
      ].join(' ')}
    >
      {showImage && (
        <img
          src={src}
          alt={altText}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          draggable={false}
        />
      )}
      {showInitials && (
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color:      '#ffffff',
            lineHeight: 1,
            letterSpacing: size === 'xl' ? '-0.5px' : undefined,
          }}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </button>
  ) : (
    <div
      role="img"
      aria-label={altText}
      style={circleStyle}
      className={className}
    >
      {showImage && (
        <img
          src={src}
          alt={altText}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          draggable={false}
        />
      )}
      {showInitials && (
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color:      '#ffffff',
            lineHeight: 1,
            letterSpacing: size === 'xl' ? '-0.5px' : undefined,
          }}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </div>
  );

  // ── Wrapper with optional online dot ─────────────────────────────────────────

  if (!online) return Circle;

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}
    >
      {Circle}
      {/* Online indicator */}
      <div
        aria-label="Online"
        style={{
          position:    'absolute',
          bottom:      dotRing / 2,
          right:       dotRing / 2,
          width:       dotSize,
          height:      dotSize,
          borderRadius:'50%',
          backgroundColor: 'var(--color-success)',
          border:      `${dotRing}px solid white`,
          boxSizing:   'border-box',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ── AvatarGroup ───────────────────────────────────────────────────────────────

export interface AvatarGroupProps {
  children: ReactNode;
  /** Negative overlap in px. Default: -8. */
  overlap?: number;
  size?: AvatarSize;
  className?: string;
}

/**
 * AvatarGroup — overlapping stack of Avatars.
 * Renders children right-to-left so the first avatar is on top.
 *
 * ```tsx
 * <AvatarGroup size="sm">
 *   <Avatar name="Alice" />
 *   <Avatar name="Bob" />
 *   <Avatar name="Charlie" />
 *   <span style={{ ... }}>+4</span>
 * </AvatarGroup>
 * ```
 */
export function AvatarGroup({
  children,
  overlap = -8,
  className = '',
}: AvatarGroupProps) {
  const items = React.Children.toArray(children);

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      {items.map((child, i) => (
        <div
          key={i}
          style={{
            // Each item is offset left by `overlap` px relative to the previous
            marginLeft: i === 0 ? 0 : overlap,
            // Right-to-left stacking: first child is on top
            zIndex: items.length - i,
            position: 'relative',
            // White ring between avatars
            borderRadius: '50%',
            boxShadow: '0 0 0 2px white',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
