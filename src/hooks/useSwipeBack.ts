import { useEffect, useRef } from 'react';

/**
 * Detects a right swipe starting within `edgePx` of the left edge
 * and calls `onBack`. Mimics iOS swipe-back gesture.
 */
export function useSwipeBack(onBack: () => void, enabled = true, edgePx = 40) {
  const ref = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const eligible = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      eligible.current = startX.current <= edgePx;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!eligible.current) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - startY.current);
      // Must be more horizontal than vertical, and swipe far enough
      if (dx > 80 && dy < 80) {
        onBack();
      }
      eligible.current = false;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onBack, enabled, edgePx]);

  return ref;
}
