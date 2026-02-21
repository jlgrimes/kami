/**
 * useFocusTrap — keyboard focus trap for modal overlays.
 *
 * When `active` is true:
 *   1. Focuses the first focusable element inside the container.
 *   2. Traps Tab / Shift+Tab so focus cycles within the container.
 *   3. Calls `onEscape` when the Escape key is pressed.
 *
 * When `active` transitions to false:
 *   - Restores focus to the element that was focused before trap activated.
 *
 * Focusable selector: all interactive elements except those with
 * tabindex="-1" or the `disabled` attribute.
 *
 * Usage:
 * ```ts
 * const containerRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(containerRef, open, () => setOpen(false));
 *
 * // In JSX:
 * <div ref={containerRef} role="dialog" aria-modal="true">
 *   ...
 * </div>
 * ```
 */

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'summary',
  '[contenteditable="true"]',
].join(', ');

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
) {
  // Remember what was focused before the trap activated so we can restore it
  const restoreFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) {
      // Restore focus to the previously-focused element
      if (restoreFocusRef.current && restoreFocusRef.current instanceof HTMLElement) {
        restoreFocusRef.current.focus({ preventScroll: true });
      }
      restoreFocusRef.current = null;
      return;
    }

    // Save currently focused element
    restoreFocusRef.current = document.activeElement;

    // Focus first focusable element in container (slight delay so the element
    // is visible after the enter animation starts)
    const focusFirst = () => {
      const container = containerRef.current;
      if (!container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter(el => !el.closest('[aria-hidden="true"]'));

      if (focusable.length > 0) {
        focusable[0].focus({ preventScroll: true });
      } else {
        // If nothing is focusable, make the container itself focusable
        container.tabIndex = -1;
        container.focus({ preventScroll: true });
      }
    };

    const timer = setTimeout(focusFirst, 80); // after spring animation starts

    // ── Tab key trap ─────────────────────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter(el => !el.closest('[aria-hidden="true"]'));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if at first, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else {
        // Tab: if at last, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, containerRef, onEscape]);
}
