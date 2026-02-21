/**
 * Toast / Snackbar — auto-dismiss notification system.
 *
 * API:
 *   const toast = useToast();
 *   toast.show('Saved!');
 *   toast.show('Failed to save', { variant: 'error', duration: 4000 });
 *   toast.show('Bookmark added', { variant: 'success' });
 *   toast.show('Lesson complete', { variant: 'success', position: 'top' });
 *
 * Mount <ToastProvider> wrapping your app (or just AppShell).
 * Toasts stack at the bottom (or top) of the screen above the tab bar.
 * Animation: slide-up + fade-in on enter; fade-out on exit (Web Animations API).
 */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastVariant = 'default' | 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'bottom' | 'top';

export interface ToastOptions {
  /** Visual variant (default: 'default') */
  variant?: ToastVariant;
  /** Auto-dismiss after this many ms (default: 2600) */
  duration?: number;
  /** Screen position (default: 'bottom') */
  position?: ToastPosition;
  /** Short action label (e.g. 'Undo') */
  action?: { label: string; onPress: () => void };
}

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
  position: ToastPosition;
  action?: ToastOptions['action'];
  exiting: boolean;
}

interface ToastContextValue {
  show: (message: string, opts?: ToastOptions) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// ── Toast chip visuals ────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ToastVariant, { bg: string; icon: string }> = {
  default: { bg: 'bg-[var(--color-ink)] text-white dark:bg-[var(--surface-solid)]', icon: '' },
  success: { bg: 'bg-[var(--surface-success)] text-[var(--color-success)]', icon: '✓' },
  error:   { bg: 'bg-[var(--surface-danger)] text-[var(--color-danger)]', icon: '✕' },
  info:    { bg: 'bg-[var(--surface-info)] text-[var(--color-subject)]', icon: 'ℹ' },
  warning: { bg: 'bg-[var(--surface-warning)] text-[var(--color-warning)]', icon: '⚠' },
};

// ── Toast chip ────────────────────────────────────────────────────────────────

function ToastChip({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const v = VARIANT_STYLES[item.variant];
  const ref = useRef<HTMLDivElement>(null);

  // Slide-up + fade-in on mount
  const handleMount = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    node.animate(
      [
        { opacity: 0, transform: 'translateY(16px) scale(0.96)' },
        { opacity: 1, transform: 'translateY(0)    scale(1)' },
      ],
      { duration: 260, easing: 'cubic-bezier(0.34, 1.28, 0.64, 1)', fill: 'forwards' },
    );
  }, []);

  return (
    <div
      ref={ref}
      style={{ opacity: item.exiting ? 0 : undefined, transition: item.exiting ? 'opacity 200ms ease' : undefined }}
    >
      <div
        ref={handleMount}
        className={[
          'flex items-center gap-2 px-4 py-3 rounded-2xl shadow-[var(--shadow-md)]',
          'max-w-[calc(100vw-48px)] min-w-[180px]',
          v.bg,
        ].join(' ')}
      >
        {v.icon && (
          <span className="text-base font-bold shrink-0 leading-none">{v.icon}</span>
        )}
        <span className="text-sm font-semibold leading-snug flex-1">{item.message}</span>
        {item.action && (
          <button
            onClick={() => {
              item.action!.onPress();
              onDismiss(item.id);
            }}
            className="text-xs font-bold opacity-70 hover:opacity-100 uppercase tracking-wide shrink-0 active:opacity-50 pl-2"
          >
            {item.action.label}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────

let _nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    // Mark as exiting (fade out) then remove
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 220);
  }, []);

  const show = useCallback((message: string, opts: ToastOptions = {}) => {
    const id = _nextId++;
    const duration = opts.duration ?? 2600;
    const item: ToastItem = {
      id,
      message,
      variant: opts.variant ?? 'default',
      duration,
      position: opts.position ?? 'bottom',
      action: opts.action,
      exiting: false,
    };
    setToasts(prev => [...prev.slice(-3), item]); // keep max 4 in stack
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const bottomToasts = toasts.filter(t => t.position === 'bottom');
  const topToasts    = toasts.filter(t => t.position === 'top');

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* Bottom toasts — above tab bar */}
      {bottomToasts.length > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 pb-[calc(env(safe-area-inset-bottom)+68px)] pointer-events-none"
          aria-live="polite"
          aria-atomic="true"
        >
          {bottomToasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastChip item={t} onDismiss={dismiss} />
            </div>
          ))}
        </div>
      )}

      {/* Top toasts — below status bar */}
      {topToasts.length > 0 && (
        <div
          className="fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 pt-[calc(env(safe-area-inset-top)+12px)] pointer-events-none"
          aria-live="polite"
          aria-atomic="true"
        >
          {topToasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastChip item={t} onDismiss={dismiss} />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
