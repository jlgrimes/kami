import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ── Imperative handle (for App to call popToRoot) ─────────────────────────────

export interface NavigationHandle {
  /** Pop all pages back to root. animated=false for silent tab resets. */
  popToRoot: (animated?: boolean) => void;
}

// ── Easing ───────────────────────────────────────────────────────────────────
// Aggressive ease-out — fast deceleration like iOS nav
// Both push and pop use ease-out — fast start, gentle tail
const PUSH_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const POP_EASE  = 'cubic-bezier(0.16, 1, 0.3, 1)';
const SNAP_EASE = 'cubic-bezier(0.34, 1.28, 0.64, 1)'; // spring overshoot on snap-back

// ── Navigation context (push/pop/canGoBack) ───────────────────────────────────

interface NavigationContextValue {
  push: (page: ReactNode) => void;
  pop: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within <NavigationStack>');
  return ctx;
}

// ── Page depth context — each page knows its own depth, independent of state ──
// This prevents the back button from appearing on home during a push transition.

const PageDepthContext = createContext(0);

export function usePageDepth() {
  return useContext(PageDepthContext);
}

// ── Stack entry ──────────────────────────────────────────────────────────────

interface StackEntry {
  id: string;
  page: ReactNode;
}

// ── DOM helper ───────────────────────────────────────────────────────────────

function tx(el: HTMLElement | null, x: number, transition = 'none') {
  if (!el) return;
  el.style.transition = transition;
  el.style.transform = `translate3d(${x}px,0,0)`;
}

// ── NavigationStack ──────────────────────────────────────────────────────────

export const NavigationStack = forwardRef<NavigationHandle, { initialPage: ReactNode }>(
function NavigationStack({ initialPage }, ref) {
  const winW = window.innerWidth;

  const [stack, setStack] = useState<StackEntry[]>([
    { id: 'root', page: initialPage },
  ]);

  const elMap     = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable refs so touch handlers always see fresh values
  const stackRef = useRef(stack);
  stackRef.current = stack;

  const canGoBackRef = useRef(false);
  canGoBackRef.current = stack.length > 1;

  const getEl  = (id: string) => elMap.current.get(id) ?? null;
  const currId = () => stackRef.current[stackRef.current.length - 1].id;
  const prevId = () =>
    stackRef.current.length > 1
      ? stackRef.current[stackRef.current.length - 2].id
      : null;

  // ── Stack mutations ───────────────────────────────────────────────────────

  const removeTop = useCallback(
    () => setStack(p => (p.length > 1 ? p.slice(0, -1) : p)),
    [],
  );

  const pop = useCallback(() => {
    const cId = currId(), pId = prevId();
    tx(getEl(cId), winW, `transform 0.28s ${POP_EASE}`);
    tx(pId ? getEl(pId) : null, 0, `transform 0.28s ${POP_EASE}`);
    setTimeout(removeTop, 280);
  }, [winW, removeTop]);

  const push = useCallback((page: ReactNode) => {
    setStack(p => [...p, { id: crypto.randomUUID(), page }]);
  }, []);

  // ── Pop to root ────────────────────────────────────────────────────────────

  const popToRoot = useCallback((animated = true) => {
    if (stackRef.current.length <= 1) return;
    const rootEntry = stackRef.current[0];
    const currEntry = stackRef.current[stackRef.current.length - 1];
    const rootEl = getEl(rootEntry.id);
    const currEl = getEl(currEntry.id);

    if (!animated) {
      // Silent reset — used when switching away from a tab
      if (rootEl) tx(rootEl, 0);
      setStack([rootEntry]);
      return;
    }

    // Animated — same as pop but target is always root.
    // Bring root to -30% starting position then animate both.
    if (rootEl) tx(rootEl, -winW * 0.3);
    tx(currEl, winW, `transform 0.28s ${POP_EASE}`);
    if (rootEl) tx(rootEl, 0, `transform 0.28s ${POP_EASE}`);

    setTimeout(() => setStack([rootEntry]), 285);
  }, [winW]);

  useImperativeHandle(ref, () => ({ popToRoot }), [popToRoot]);

  // ── Push animation ─────────────────────────────────────────────────────────

  const prevLen = useRef(stack.length);
  useLayoutEffect(() => {
    const newLen = stack.length;
    if (newLen <= prevLen.current) { prevLen.current = newLen; return; }
    prevLen.current = newLen;

    const cId = currId(), pId = prevId();
    const curr = getEl(cId), prev = pId ? getEl(pId) : null;

    tx(curr, winW); // place off-screen before paint
    curr?.getBoundingClientRect(); // flush

    tx(curr, 0,           `transform 0.38s ${PUSH_EASE}`);
    tx(prev, -winW * 0.3, `transform 0.38s ${PUSH_EASE}`);
  }, [stack.length, winW]);

  // ── Touch gesture — direction-detecting, scroll-blocking ─────────────────
  // Using touch events (not pointer events) so we can call preventDefault
  // to block scroll when a horizontal swipe is confirmed.

  const gesture = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    locked: false,    // horizontal direction confirmed
    cancelled: false, // vertical — let scroll win
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      if (!canGoBackRef.current) return;
      const t = e.touches[0];
      if (t.clientX > 44) return; // only left-edge zone
      gesture.current = {
        active: true,
        startX: t.clientX,
        startY: t.clientY,
        startTime: Date.now(),
        locked: false,
        cancelled: false,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      const g = gesture.current;
      if (!g.active || g.cancelled) return;

      const t = e.touches[0];
      const dx = t.clientX - g.startX;
      const dy = Math.abs(t.clientY - g.startY);

      // Wait until we have enough movement to determine direction
      if (!g.locked) {
        if (Math.abs(dx) < 6 && dy < 6) return;
        if (dx > 0 && dx >= dy) {
          g.locked = true; // confirmed horizontal right-swipe
        } else {
          g.cancelled = true;
          g.active = false;
          return; // let scroll proceed normally
        }
      }

      // Block scroll — this is why we need non-passive
      e.preventDefault();

      const clampedDx = Math.max(0, dx);
      const cId = currId(), pId = prevId();
      tx(getEl(cId), clampedDx);
      tx(pId ? getEl(pId) : null, -winW * 0.3 + clampedDx * 0.3);
    };

    const onTouchEnd = (e: TouchEvent) => {
      const g = gesture.current;
      if (!g.active || g.cancelled) { g.active = false; return; }
      g.active = false;

      const t = e.changedTouches[0];
      const dx = Math.max(0, t.clientX - g.startX);
      const dt = Math.max(Date.now() - g.startTime, 1);
      const vel = dx / dt; // px/ms

      const cId = currId(), pId = prevId();
      const curr = getEl(cId), prev = pId ? getEl(pId) : null;

      if (dx > winW * 0.35 || vel > 0.4) {
        tx(curr, winW, `transform 0.22s ${POP_EASE}`);
        tx(prev, 0,    `transform 0.22s ${POP_EASE}`);
        setTimeout(removeTop, 220);
      } else {
        tx(curr, 0,           `transform 0.3s ${SNAP_EASE}`);
        tx(prev, -winW * 0.3, `transform 0.3s ${SNAP_EASE}`);
      }
    };

    // touchstart/end passive, touchmove NON-PASSIVE so we can preventDefault
    container.addEventListener('touchstart',  onTouchStart, { passive: true });
    container.addEventListener('touchmove',   onTouchMove,  { passive: false });
    container.addEventListener('touchend',    onTouchEnd,   { passive: true });
    container.addEventListener('touchcancel', onTouchEnd,   { passive: true });

    return () => {
      container.removeEventListener('touchstart',  onTouchStart);
      container.removeEventListener('touchmove',   onTouchMove);
      container.removeEventListener('touchend',    onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [winW, removeTop]);

  // ── Render ────────────────────────────────────────────────────────────────

  const canGoBack = stack.length > 1;

  return (
    <NavigationContext.Provider value={{ push, pop, canGoBack }}>
      <div ref={containerRef} className="h-dvh overflow-hidden relative bg-[var(--color-paper)]">
        {stack.map((entry, i) => {
          const isCurrent = i === stack.length - 1;
          const isPrev    = i === stack.length - 2;
          const hidden    = !isCurrent && !isPrev;

          return (
            // Each page gets its own depth — Navbar reads this, not global canGoBack
            <PageDepthContext.Provider key={entry.id} value={i}>
              <div
                ref={el => {
                  if (el) elMap.current.set(entry.id, el);
                  else    elMap.current.delete(entry.id);
                }}
                className="absolute inset-0 will-change-transform"
                style={{
                  visibility: hidden ? 'hidden' : 'visible',
                  transform: isCurrent
                    ? 'translate3d(0,0,0)'
                    : `translate3d(${-winW * 0.3}px,0,0)`,
                  zIndex: i,
                }}
              >
                {entry.page}
              </div>
            </PageDepthContext.Provider>
          );
        })}
      </div>
    </NavigationContext.Provider>
  );
});

