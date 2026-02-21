/**
 * PullToRefresh — iOS-style overscroll-to-refresh container.
 *
 * Wraps any scrollable content. When the user pulls down from the top, a
 * circular progress indicator appears. Past the threshold it snaps to a loading
 * position and calls `onRefresh()`. Once the promise resolves, the indicator
 * springs back and resets.
 *
 * Implementation:
 * - Native touch events on the container (no synthetic events, no 3rd-party libs)
 * - Content translates down via CSS transform — no layout reflow
 * - Indicator: SVG arc (0→full circle) while pulling, spinning ring while loading
 * - Spring snap back via Web Animations API
 * - Prevents pull when scrollTop > 0 (natural scroll takes priority)
 * - Capacitor WKWebView safe
 *
 * Usage:
 * ```tsx
 * const [refreshing, setRefreshing] = useState(false);
 *
 * <PullToRefresh
 *   onRefresh={async () => {
 *     setRefreshing(true);
 *     await fetchData();
 *     setRefreshing(false);
 *   }}
 * >
 *   <YourScrollableContent />
 * </PullToRefresh>
 * ```
 */

import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { hapticLight, hapticSuccess } from './haptics';

// ── Config ────────────────────────────────────────────────────────────────────

const THRESHOLD   = 72;   // px — pull distance to trigger refresh
const MAX_PULL    = 108;  // px — max visual pull (rubber-bands above THRESHOLD)
const INDICATOR_R = 14;   // radius of spinner ring (px)
const INDICATOR_D = INDICATOR_R * 2 + 8; // overall indicator size
const CIRCUMF     = 2 * Math.PI * INDICATOR_R;

const SPRING_OUT = { duration: 260, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' } as const;

// ── Indicator ─────────────────────────────────────────────────────────────────

interface IndicatorProps {
  /** 0–1: fill progress arc while pulling */
  progress: number;
  /** true: switch to spinning animation (refreshing) */
  spinning: boolean;
  /** vertical offset — controlled by pull amount */
  translateY: number;
}

function Indicator({ progress, spinning, translateY }: IndicatorProps) {
  const size = INDICATOR_D + 8;
  const cx   = size / 2;

  // Arc: strokeDashoffset drives progress (full circle at progress=1)
  const dash   = CIRCUMF;
  const offset = dash - dash * Math.min(progress, 1);

  return (
    <div
      aria-hidden="true"
      style={{
        position:  'absolute',
        top:       0,
        left:      '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        width:     size,
        height:    size,
        display:   'flex',
        alignItems:'center',
        justifyContent: 'center',
        // Only visible when pulled
        opacity:   Math.max(0, Math.min(1, translateY / 24)),
        transition: spinning ? undefined : 'opacity 80ms ease',
        pointerEvents: 'none',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        {/* Background track */}
        <circle
          cx={cx} cy={cx} r={INDICATOR_R}
          stroke="var(--surface-divider)"
          strokeWidth="2.5"
        />
        {/* Progress/spinning arc */}
        <circle
          cx={cx} cy={cx} r={INDICATOR_R}
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={spinning ? CIRCUMF * 0.75 : offset}
          transform={`rotate(-90 ${cx} ${cx})`}
          style={spinning ? {
            animationName:            'kami-ptr-spin',
            animationDuration:        '800ms',
            animationTimingFunction:  'linear',
            animationIterationCount:  'infinite',
          } : {
            transition: 'stroke-dashoffset 60ms linear',
          }}
        />
      </svg>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export interface PullToRefreshProps {
  /** Async callback called when pull-to-refresh is triggered. */
  onRefresh: () => Promise<void>;
  children: ReactNode;
  /**
   * Disable the pull gesture (e.g. while an animation is in progress).
   * The component will still render its children normally.
   */
  disabled?: boolean;
  /** Pull distance in px before refresh triggers. Default: 72. */
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

type PTRPhase = 'idle' | 'pulling' | 'triggered' | 'refreshing' | 'snapping';

export function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
  threshold = THRESHOLD,
  className = '',
  style,
}: PullToRefreshProps) {
  const wrapRef     = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  // Pull state
  const phase       = useRef<PTRPhase>('idle');
  const startY      = useRef(0);
  const pullY       = useRef(0);   // current pull distance (0–MAX_PULL)
  const hasFired    = useRef(false);

  // React state only for the indicator — keep layout-impacting state minimal
  const [indicatorState, setIndicatorState] = useState({
    translateY: -INDICATOR_D,
    progress:   0,
    spinning:   false,
  });

  // ── Translate content element ───────────────────────────────────────────────
  const setContentTranslate = useCallback((y: number, animate?: boolean) => {
    const el = contentRef.current;
    if (!el) return;
    if (animate) {
      el.animate(
        [{ transform: `translateY(${y}px)` }],
        { ...SPRING_OUT, fill: 'forwards' },
      );
    } else {
      el.style.transform = `translateY(${y}px)`;
    }
  }, []);

  // ── Snap back helper ────────────────────────────────────────────────────────
  const snapBack = useCallback(() => {
    phase.current = 'snapping';
    setContentTranslate(0, true);
    setIndicatorState({ translateY: -INDICATOR_D, progress: 0, spinning: false });
    setTimeout(() => { phase.current = 'idle'; }, SPRING_OUT.duration + 50);
  }, [setContentTranslate]);

  // ── Touch handlers ──────────────────────────────────────────────────────────
  useEffect(() => {
    const wrap   = wrapRef.current;
    const scroll = scrollRef.current;
    if (!wrap || !scroll) return;

    const onTouchStart = (e: TouchEvent) => {
      if (disabled || phase.current !== 'idle') return;
      // Only start pull if scrollable content is at the top
      if (scroll.scrollTop > 2) return;
      startY.current  = e.touches[0].clientY;
      pullY.current   = 0;
      hasFired.current = false;
      phase.current   = 'pulling';
    };

    const onTouchMove = (e: TouchEvent) => {
      if (phase.current !== 'pulling' && phase.current !== 'triggered') return;

      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) {
        // User scrolled up — abort pull and let native scroll take over
        if (phase.current === 'pulling') { phase.current = 'idle'; }
        return;
      }

      // Prevent native scroll during pull gesture
      if (scroll.scrollTop <= 0) e.preventDefault();

      // Rubber-band: pull slows above threshold
      const raw = dy;
      const clamped = raw < threshold
        ? raw
        : threshold + (raw - threshold) * 0.25;

      pullY.current = Math.min(clamped, MAX_PULL);
      const progress = Math.min(pullY.current / threshold, 1);

      // Snap to "triggered" state at threshold
      if (pullY.current >= threshold && !hasFired.current) {
        hasFired.current = true;
        phase.current    = 'triggered';
        hapticLight();
      } else if (pullY.current < threshold) {
        phase.current    = 'pulling';
        hasFired.current = false;
      }

      // Translate content + update indicator
      setContentTranslate(pullY.current);
      setIndicatorState({
        translateY: pullY.current - INDICATOR_D - 8,
        progress,
        spinning: false,
      });
    };

    const onTouchEnd = async () => {
      if (phase.current === 'triggered') {
        // Lock at threshold height while refreshing
        phase.current = 'refreshing';
        const lockY   = threshold + 8;
        setContentTranslate(lockY, true);
        setIndicatorState(s => ({ ...s, translateY: lockY - INDICATOR_D - 8, spinning: true }));

        hapticSuccess();
        try {
          await onRefresh();
        } finally {
          snapBack();
        }
      } else if (phase.current === 'pulling') {
        snapBack();
      }
    };

    // Passive: false on move so we can preventDefault
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchmove',  onTouchMove,  { passive: false });
    wrap.addEventListener('touchend',   onTouchEnd,   { passive: true });
    wrap.addEventListener('touchcancel', snapBack,    { passive: true } as EventListenerOptions);

    return () => {
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchmove',  onTouchMove);
      wrap.removeEventListener('touchend',   onTouchEnd);
      wrap.removeEventListener('touchcancel', snapBack as EventListener);
    };
  }, [disabled, threshold, onRefresh, setContentTranslate, snapBack]);

  return (
    <>
      {/* Keyframe for spinner rotation — injected once */}
      <style>{`
        @keyframes kami-ptr-spin {
          from { transform: rotate(-90deg); }
          to   { transform: rotate(270deg); }
        }
      `}</style>

      <div
        ref={wrapRef}
        className={className}
        style={{ position: 'relative', overflow: 'hidden', height: '100%', ...style }}
      >
        {/* Pull indicator — sits above content, revealed by content translate */}
        <Indicator {...indicatorState} />

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          style={{
            height:    '100%',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          {/* Content wrapper — gets translated on pull */}
          <div ref={contentRef} style={{ willChange: 'transform' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
