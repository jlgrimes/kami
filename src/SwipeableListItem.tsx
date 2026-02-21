/**
 * SwipeableListItem — iOS-style swipe-to-reveal row actions.
 *
 * The most iconic iOS gesture: swipe left to reveal Delete/Archive, swipe right
 * for Read/Pin. Uses native pointer events for precise horizontal tracking with
 * vertical scroll coexistence.
 *
 * Features:
 * - Swipe left (←) reveals trailing actions (Delete, Archive, Flag…)
 * - Swipe right (→) reveals leading actions (Read, Pin, Reply…)
 * - Spring snap to open/closed with Web Animations API
 * - Full-swipe-to-trigger for primary trailing action (configurable)
 * - Haptic feedback: light on snap-open, heavy on destructive full-swipe
 * - Elastic reveal: actions grow with swipe distance (iOS rubber-band feel)
 * - 44px min touch targets on all action buttons
 * - Keyboard accessible: Escape to close open row
 * - Drop-in alongside List + ListItem
 *
 * Usage:
 * ```tsx
 * <List>
 *   <SwipeableListItem
 *     trailingActions={[
 *       {
 *         label: 'Delete',
 *         variant: 'destructive',
 *         icon: '🗑',
 *         onPress: () => deleteItem(id),
 *       },
 *       {
 *         label: 'Archive',
 *         variant: 'secondary',
 *         icon: '📦',
 *         onPress: () => archiveItem(id),
 *       },
 *     ]}
 *     leadingActions={[
 *       { label: 'Pin', icon: '📌', variant: 'primary', onPress: () => pin(id) },
 *     ]}
 *   >
 *     <ListItem title="My lesson" subtitle="Swipe me left or right" chevron />
 *   </SwipeableListItem>
 * </List>
 * ```
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { hapticLight, hapticHeavy } from './haptics';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SwipeActionVariant = 'destructive' | 'primary' | 'secondary';

export interface SwipeAction {
  label: string;
  /** Optional emoji or icon character */
  icon?: string;
  /** Colour preset. Default: 'secondary'. */
  variant?: SwipeActionVariant;
  onPress: () => void;
  /** Minimum width in px. Default: 80. */
  width?: number;
}

export interface SwipeableListItemProps {
  children: ReactNode;
  /** Actions revealed on left swipe (trailing, right side). */
  trailingActions?: SwipeAction[];
  /** Actions revealed on right swipe (leading, left side). */
  leadingActions?: SwipeAction[];
  /**
   * Trigger the primary (first) trailing action when the user swipes
   * past `fullSwipeThreshold` fraction of row width. Default: true.
   */
  fullSwipeEnabled?: boolean;
  /**
   * Fraction of row width that triggers a full-swipe action. Default: 0.55.
   */
  fullSwipeThreshold?: number;
  className?: string;
}

// ── Action colours ────────────────────────────────────────────────────────────

const ACTION_BG: Record<SwipeActionVariant, string> = {
  destructive: 'var(--color-danger)',
  primary:     'var(--color-accent)',
  secondary:   'var(--color-muted)',
};

// ── Spring config ─────────────────────────────────────────────────────────────

const SPRING_SNAP  = { duration: 320, easing: 'cubic-bezier(0.34, 1.28, 0.64, 1)' } as const;
const SPRING_CLOSE = { duration: 260, easing: 'cubic-bezier(0.4, 0, 0.6, 1)'       } as const;

// Ratio of action panel width when row is snapped open
const SNAP_OPEN_RATIO = 0.88; // reveal ~88% of the action panel

// Horizontal intent lock threshold (px): if dragged this far horizontally,
// we claim the gesture and suppress vertical scroll.
const HORIZ_LOCK_PX = 8;
// Direction determination threshold: requires more horiz than vert movement
const DIRECTION_RATIO = 1.2;

// ── Action button ─────────────────────────────────────────────────────────────

function ActionButton({
  action,
  targetWidth,
  side,
}: {
  action: SwipeAction;
  targetWidth: number;
  side: 'leading' | 'trailing';
}) {
  const bg = ACTION_BG[action.variant ?? 'secondary'];

  return (
    <button
      type="button"
      onClick={() => action.onPress()}
      style={{
        width:          targetWidth,
        minWidth:       targetWidth,
        minHeight:      44,
        height:         '100%',
        background:     bg,
        border:         'none',
        color:          'white',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            2,
        cursor:         'pointer',
        flexShrink:     0,
        // Leading actions are flush right; trailing flush left
        order: side === 'leading' ? -1 : 1,
        transition:     'opacity 100ms ease',
      }}
      onPointerDown={e => { e.currentTarget.style.opacity = '0.75'; }}
      onPointerUp={e =>   { e.currentTarget.style.opacity = '1'; }}
      onPointerLeave={e => { e.currentTarget.style.opacity = '1'; }}
    >
      {action.icon && (
        <span style={{ fontSize: 18, lineHeight: 1 }}>{action.icon}</span>
      )}
      <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1, letterSpacing: '0.02em' }}>
        {action.label}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SwipeableListItem({
  children,
  trailingActions = [],
  leadingActions  = [],
  fullSwipeEnabled    = true,
  fullSwipeThreshold  = 0.55,
  className = '',
}: SwipeableListItemProps) {
  const rowRef         = useRef<HTMLDivElement>(null);
  const contentRef     = useRef<HTMLDivElement>(null);
  const containerRef   = useRef<HTMLDivElement>(null);

  // Current translateX of the content row
  const translateX     = useRef(0);
  // Whether the row is currently snapped open (and in which direction)
  const snappedDir     = useRef<'trailing' | 'leading' | null>(null);

  // React state only for full-swipe flash (destructive red background)
  const [fullSwipeActive, setFullSwipeActive] = useState(false);

  // ── Computed widths ────────────────────────────────────────────────────────

  const trailingPanelWidth = trailingActions.reduce(
    (sum, a) => sum + (a.width ?? 80), 0,
  );
  const leadingPanelWidth = leadingActions.reduce(
    (sum, a) => sum + (a.width ?? 80), 0,
  );

  // ── Apply transform ────────────────────────────────────────────────────────

  const setTranslate = useCallback((x: number, animate?: boolean) => {
    const el = contentRef.current;
    if (!el) return;
    translateX.current = x;
    if (animate) {
      const cfg = x === 0 ? SPRING_CLOSE : SPRING_SNAP;
      el.animate(
        [{ transform: `translateX(${x}px)` }],
        { ...cfg, fill: 'forwards' },
      );
    } else {
      el.style.transform = `translateX(${x}px)`;
    }
  }, []);

  const closeRow = useCallback(() => {
    snappedDir.current = null;
    setTranslate(0, true);
  }, [setTranslate]);

  // ── Gesture handling ───────────────────────────────────────────────────────

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    let startX     = 0, startY     = 0;
    let startTx    = 0;  // translateX at gesture start
    let phase: 'idle' | 'deciding' | 'horiz' | 'vert' = 'idle';
    let fullSwiped = false;

    const getRowWidth = () => containerRef.current?.offsetWidth ?? 375;

    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      startX  = e.clientX;
      startY  = e.clientY;
      startTx = translateX.current;
      phase   = 'deciding';
      fullSwiped = false;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!e.isPrimary || phase === 'idle' || phase === 'vert') return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const absDx = Math.abs(dx), absDy = Math.abs(dy);

      // Determine gesture direction
      if (phase === 'deciding') {
        if (absDx < HORIZ_LOCK_PX && absDy < HORIZ_LOCK_PX) return; // too early
        if (absDy > absDx * DIRECTION_RATIO) {
          phase = 'vert';
          return;
        }
        phase = 'horiz';
      }

      // Horizontal gesture locked in
      e.preventDefault();

      const rowWidth     = getRowWidth();
      const rawTx        = startTx + dx;

      // Clamp with rubber-band past open position
      let clampedTx = rawTx;

      if (rawTx < 0) {
        // Trailing swipe (left)
        const maxOpen = -trailingPanelWidth;
        if (rawTx < maxOpen) {
          // Rubber band past the action panel
          const excess = rawTx - maxOpen;
          clampedTx = maxOpen + excess * 0.25;
        }
        // Full-swipe detection
        const rowFraction = Math.abs(clampedTx) / rowWidth;
        const isFullSwipe = fullSwipeEnabled && rowFraction >= fullSwipeThreshold && trailingActions.length > 0;
        if (isFullSwipe !== fullSwiped) {
          fullSwiped = isFullSwipe;
          setFullSwipeActive(isFullSwipe);
          if (isFullSwipe) hapticHeavy(); // "destructive" confirmation feel
          else hapticLight();
        }
      } else if (rawTx > 0) {
        // Leading swipe (right)
        const maxOpen = leadingPanelWidth;
        if (rawTx > maxOpen) {
          const excess = rawTx - maxOpen;
          clampedTx = maxOpen + excess * 0.25;
        }
      }

      // If no actions in that direction, rubber-band all the way
      if (clampedTx < 0 && trailingActions.length === 0) {
        clampedTx = rawTx * 0.08;
      }
      if (clampedTx > 0 && leadingActions.length === 0) {
        clampedTx = rawTx * 0.08;
      }

      setTranslate(clampedTx);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!e.isPrimary || phase !== 'horiz') {
        phase = 'idle';
        return;
      }
      phase = 'idle';

      const rowWidth = getRowWidth();
      const tx       = translateX.current;

      if (fullSwiped && trailingActions.length > 0 && tx < 0) {
        // Full swipe — trigger primary trailing action, animate off-screen
        setTranslate(-rowWidth, true);
        setFullSwipeActive(false);
        setTimeout(() => {
          trailingActions[0].onPress();
          // Reset after action runs (caller typically removes the row)
          setTimeout(() => setTranslate(0), 400);
        }, 220);
        return;
      }

      setFullSwipeActive(false);

      // Snap logic
      const threshold = 0.35; // >35% of panel width to snap open

      if (tx < 0 && trailingActions.length > 0) {
        const openX = -(trailingPanelWidth * SNAP_OPEN_RATIO);
        if (Math.abs(tx) > trailingPanelWidth * threshold) {
          // Snap open
          snappedDir.current = 'trailing';
          hapticLight();
          setTranslate(openX, true);
        } else {
          closeRow();
        }
      } else if (tx > 0 && leadingActions.length > 0) {
        const openX = leadingPanelWidth * SNAP_OPEN_RATIO;
        if (tx > leadingPanelWidth * threshold) {
          snappedDir.current = 'leading';
          hapticLight();
          setTranslate(openX, true);
        } else {
          closeRow();
        }
      } else {
        closeRow();
      }
    };

    el.addEventListener('pointerdown',   onPointerDown, { passive: true });
    el.addEventListener('pointermove',   onPointerMove, { passive: false });
    el.addEventListener('pointerup',     onPointerUp,   { passive: true });
    el.addEventListener('pointercancel', () => { phase = 'idle'; closeRow(); }, { passive: true });

    return () => {
      el.removeEventListener('pointerdown',   onPointerDown);
      el.removeEventListener('pointermove',   onPointerMove);
      el.removeEventListener('pointerup',     onPointerUp);
    };
  }, [
    trailingActions, leadingActions, trailingPanelWidth, leadingPanelWidth,
    fullSwipeEnabled, fullSwipeThreshold, setTranslate, closeRow,
  ]);

  // Keyboard: Escape closes open row
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && snappedDir.current) closeRow();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeRow]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position:   'relative',
        overflow:   'hidden',
        // Full-swipe: flash the first trailing action's colour beneath the row
        backgroundColor: fullSwipeActive && trailingActions.length > 0
          ? ACTION_BG[trailingActions[0].variant ?? 'secondary']
          : undefined,
        transition: fullSwipeActive ? 'background-color 100ms ease' : undefined,
      }}
    >
      {/* ── Leading action buttons (right swipe, appear on left) ─────────── */}
      {leadingActions.length > 0 && (
        <div
          aria-hidden="true"
          style={{
            position:       'absolute',
            left:           0,
            top:            0,
            bottom:         0,
            display:        'flex',
            alignItems:     'stretch',
            pointerEvents:  snappedDir.current === 'leading' ? 'auto' : 'none',
          }}
        >
          {leadingActions.map((action, i) => (
            <ActionButton
              key={i}
              action={action}
              targetWidth={action.width ?? 80}
              side="leading"
            />
          ))}
        </div>
      )}

      {/* ── Trailing action buttons (left swipe, appear on right) ────────── */}
      {trailingActions.length > 0 && (
        <div
          aria-hidden="true"
          style={{
            position:       'absolute',
            right:          0,
            top:            0,
            bottom:         0,
            display:        'flex',
            alignItems:     'stretch',
            pointerEvents:  snappedDir.current === 'trailing' ? 'auto' : 'none',
          }}
        >
          {trailingActions.map((action, i) => (
            <ActionButton
              key={i}
              action={action}
              targetWidth={action.width ?? 80}
              side="trailing"
            />
          ))}
        </div>
      )}

      {/* ── Row content (slides on swipe) ────────────────────────────────── */}
      <div
        ref={rowRef}
        style={{
          position:       'relative',
          zIndex:         1,
          willChange:     'transform',
          touchAction:    'pan-y', // allow vertical scroll, we handle horizontal
          cursor:         'default',
          backgroundColor: 'var(--surface-solid)',
        }}
      >
        <div ref={contentRef} style={{ willChange: 'transform' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
