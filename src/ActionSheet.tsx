/**
 * ActionSheet — iOS-style contextual action list.
 *
 * Renders a native-feel card floating above the tab bar,
 * with a separate cancel button below (matching iOS 26 design).
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *
 *   <ActionSheet
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     title="What would you like to do?"
 *     actions={[
 *       { label: 'Remove bookmark', onPress: () => remove(), destructive: true },
 *       { label: 'Share', onPress: () => share() },
 *     ]}
 *   />
 */

import { useEffect, useRef } from 'react';

export interface ActionSheetAction {
  label: string;
  onPress: () => void;
  /** Renders in --color-danger (red). Use for irreversible actions. */
  destructive?: boolean;
  /** Renders muted. Use for disabled states. */
  disabled?: boolean;
}

interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  /** Optional descriptor shown above the actions */
  title?: string;
  actions: ActionSheetAction[];
}

const SPRING = {
  enter: { duration: 340, easing: 'cubic-bezier(0.34, 1.28, 0.64, 1)' },
  exit:  { duration: 200, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' },
} as const;

export function ActionSheet({ open, onClose, title, actions }: ActionSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const cancelRef   = useRef<HTMLButtonElement>(null);
  const prevOpen    = useRef(false);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const card     = cardRef.current;
    const cancel   = cancelRef.current;
    if (!backdrop || !card || !cancel) return;

    if (open && !prevOpen.current) {
      backdrop.style.display = 'block';
      card.style.display     = 'block';
      cancel.style.display   = 'block';

      backdrop.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { ...SPRING.enter, fill: 'forwards' },
      );
      card.animate(
        [
          { opacity: 0, transform: 'translateY(20px) scale(0.97)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { ...SPRING.enter, fill: 'forwards' },
      );
      cancel.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { ...SPRING.enter, delay: 40, fill: 'forwards' },
      );
    } else if (!open && prevOpen.current) {
      const anim = backdrop.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { ...SPRING.exit, fill: 'forwards' },
      );
      card.animate(
        [
          { opacity: 1, transform: 'translateY(0) scale(1)' },
          { opacity: 0, transform: 'translateY(12px) scale(0.97)' },
        ],
        { ...SPRING.exit, fill: 'forwards' },
      );
      cancel.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { ...SPRING.exit, fill: 'forwards' },
      );
      anim.onfinish = () => {
        backdrop.style.display = 'none';
        card.style.display     = 'none';
        cancel.style.display   = 'none';
      };
    }

    prevOpen.current = open;
  }, [open]);

  const handleAction = (action: ActionSheetAction) => {
    if (action.disabled) return;
    onClose();
    // Brief delay so close animation runs before callback
    setTimeout(() => action.onPress(), 160);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        style={{ display: 'none' }}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Actions card */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Action sheet'}
        style={{ display: 'none' }}
        className={[
          'fixed inset-x-4 z-50',
          'bottom-[calc(env(safe-area-inset-bottom)+76px)]', // above tab bar
          'bg-[var(--surface-solid)] rounded-[20px]',
          'shadow-[var(--shadow-float)]',
          'overflow-hidden',
        ].join(' ')}
      >
        {title && (
          <div className="px-4 pt-4 pb-3 border-b border-[var(--surface-divider)]">
            <p className="text-xs text-gray-400 text-center font-medium leading-snug">{title}</p>
          </div>
        )}

        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleAction(action)}
            disabled={action.disabled}
            className={[
              'w-full px-4 py-[15px] text-left text-[17px] font-medium',
              'active:bg-[var(--surface-active)] transition-colors',
              i > 0 ? 'border-t border-[var(--surface-divider)]' : '',
              action.destructive ? 'text-[var(--color-danger)]' : 'text-[var(--color-ink)]',
              action.disabled   ? 'opacity-40 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Cancel button */}
      <button
        ref={cancelRef}
        onClick={onClose}
        style={{ display: 'none' }}
        className={[
          'fixed inset-x-4 z-50',
          'bottom-[calc(env(safe-area-inset-bottom)+8px)]',
          'bg-[var(--surface-solid)] rounded-[20px]',
          'py-[15px] text-center text-[17px] font-semibold text-[var(--color-accent)]',
          'shadow-[var(--shadow-float)]',
          'active:bg-[var(--surface-active)] transition-colors',
        ].join(' ')}
      >
        Cancel
      </button>
    </>
  );
}
