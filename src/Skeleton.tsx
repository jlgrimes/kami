/**
 * Skeleton — shimmer loading placeholder
 *
 * Composable building block for loading states.
 * Uses CSS animation (animate-pulse) — no JS timers, no Web Animations API.
 * Works in Capacitor WKWebView without modification.
 *
 * Usage:
 *   <Skeleton.Text lines={3} />
 *   <Skeleton.Card />
 *   <Skeleton.Circle size={40} />
 *   <Skeleton.LessonCard />
 *   <Skeleton.PhraseCard />
 */

// ── Base shimmer ──────────────────────────────────────────────────────────────

interface BaseProps {
  className?: string;
  /** Override shimmer color (defaults to --input-bg with pulse) */
  style?: React.CSSProperties;
}

function Shimmer({ className = '', style }: BaseProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'animate-pulse rounded-lg bg-[var(--input-bg)]',
        className,
      ].join(' ')}
      style={style}
    />
  );
}

// ── Text lines ────────────────────────────────────────────────────────────────

interface TextProps {
  /** Number of lines (default 1). Last line is 60% width for realism. */
  lines?: number;
  className?: string;
}

function Text({ lines = 1, className = '' }: TextProps) {
  return (
    <div className={['space-y-2', className].join(' ')} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className={[
            'h-3',
            i === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

// ── Circle (avatar / icon) ────────────────────────────────────────────────────

function Circle({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <Shimmer
      className={['rounded-full shrink-0', className].join(' ')}
      style={{ width: size, height: size }}
    />
  );
}

// ── Line (single row at arbitrary height) ─────────────────────────────────────

function Line({ width = '100%', height = 12, className = '', style }: {
  width?: string | number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Shimmer
      className={className}
      style={{ width, height, ...style }}
    />
  );
}

// ── Lesson card skeleton ──────────────────────────────────────────────────────

function LessonCard({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        'bg-[var(--surface-bg)] rounded-3xl border border-[var(--surface-border)]',
        'shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 space-y-3',
        className,
      ].join(' ')}
    >
      {/* Module dot + label */}
      <div className="flex items-center gap-2">
        <Shimmer className="w-2 h-2 rounded-full" />
        <Shimmer className="h-2.5 w-20" />
      </div>
      {/* Title */}
      <Shimmer className="h-4 w-4/5" />
      {/* Subtitle */}
      <Shimmer className="h-3 w-3/5" />
    </div>
  );
}

// ── SOS phrase card skeleton ──────────────────────────────────────────────────

function PhraseCard({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        'bg-[var(--surface-bg)] rounded-3xl border border-[var(--surface-border)]',
        'shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 space-y-2.5',
        className,
      ].join(' ')}
    >
      {/* Category badge */}
      <Shimmer className="h-2.5 w-24" />
      {/* Japanese text — tall */}
      <Shimmer className="h-7 w-2/3" />
      {/* Romaji */}
      <Shimmer className="h-2.5 w-1/2" />
      {/* English */}
      <Shimmer className="h-3 w-4/5" />
    </div>
  );
}

// ── Generic card (matches Card component shape) ───────────────────────────────

function Card({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        'bg-[var(--surface-solid)] rounded-2xl border border-[var(--surface-border)]',
        'shadow-sm p-5 space-y-3',
        className,
      ].join(' ')}
    >
      <Shimmer className="h-4 w-3/4" />
      <Text lines={2} />
    </div>
  );
}

// ── Grid of lesson card skeletons ─────────────────────────────────────────────

function LessonGrid({ count = 6, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={['grid grid-cols-1 md:grid-cols-2 gap-3', className].join(' ')}>
      {Array.from({ length: count }).map((_, i) => (
        <LessonCard key={i} />
      ))}
    </div>
  );
}

// ── Namespace export ──────────────────────────────────────────────────────────

export const Skeleton = {
  /** Shimmer rectangle — use for arbitrary shapes. */
  Box: Shimmer,
  /** One or more text lines (last line shorter for realism). */
  Text,
  /** Circle — for avatars, icons. */
  Circle,
  /** Single horizontal bar at arbitrary width/height. */
  Line,
  /** Full lesson card placeholder (matches LessonCard shape). */
  LessonCard,
  /** SOS phrase card placeholder. */
  PhraseCard,
  /** Generic white card placeholder (matches Card component). */
  Card,
  /** Full two-column responsive grid of LessonCard skeletons. */
  LessonGrid,
};
