/**
 * BottomSheet — iOS-native modal bottom panel.
 *
 * Features:
 * - Drag handle at the top
 * - Two snap points: open (auto-height) and closed (dismiss)
 * - Backdrop blur overlay
 * - Spring physics via Web Animations API
 * - Capacitor WKWebView compatible (no ResizeObserver needed)
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *
 *   <BottomSheet open={open} onClose={() => setOpen(false)} title="Options">
 *     <p>Content here</p>
 *   </BottomSheet>
 */

import { useCallback, useEffect, useRef, type ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Optional header title */
  title?: string;
  children: ReactNode;
}

const SPRING = {
  enter: { duration: 360, easing: 'cubic-bezier(0.34, 1.28, 0.64, 1)' },
  exit:  { duration: 240, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' },
} as const;

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef    = useRef<HTMLDivElement>(null);
  const prevOpen    = useRef(false);

  // Animate open/close transitions
  useEffect(() => {
    const backdrop = backdropRef.current;
    const sheet    = sheetRef.current;
    if (!backdrop || !sheet) return;

    if (open && !prevOpen.current) {
      // Enter
      backdrop.style.display = 'block';
      sheet.style.display    = 'block';

      backdrop.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { ...SPRING.enter, fill: 'forwards' },
      );
      sheet.animate(
        [
          { transform: 'translateY(100%)' },
          { transform: 'translateY(0)' },
        ],
        { ...SPRING.enter, fill: 'forwards' },
      );
    } else if (!open && prevOpen.current) {
      // Exit
      const backAnim = backdrop.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { ...SPRING.exit, fill: 'forwards' },
      );
      sheet.animate(
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(100%)' },
        ],
        { ...SPRING.exit, fill: 'forwards' },
      );
      backAnim.onfinish = () => {
        backdrop.style.display = 'none';
        sheet.style.display    = 'none';
      };
    }

    prevOpen.current = open;
  }, [open]);

  // Touch-to-dismiss on drag handle
  const dragStartY  = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - dragStartY.current;
    if (dy > 60) onClose();
    dragStartY.current = null;
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        style={{ display: 'none' }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ display: 'none' }}
        className={[
          'fixed inset-x-0 bottom-0 z-50',
          'bg-[var(--surface-solid)] rounded-t-[28px]',
          'shadow-[var(--shadow-float)]',
          'max-h-[90dvh] flex flex-col',
        ].join(' ')}
      >
        {/* Drag handle + header */}
        <div
          className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none shrink-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* iOS drag pill */}
          <div className="w-9 h-1 bg-[var(--surface-divider)] rounded-full mb-3" />
          {title && (
            <p className="text-[17px] font-semibold text-[var(--color-ink)] pb-1">{title}</p>
          )}
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] flex-1"
        >
          {children}
        </div>
      </div>
    </>
  );
}
