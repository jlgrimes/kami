/**
 * WheelPicker + DatePicker — iOS drum-roll picker.
 *
 * Exports:
 *   WheelPicker   — primitive scrollable column (strings, numbers, anything with a label)
 *   DatePicker    — composes WheelPicker columns for date / time / datetime
 *   useDatePicker — hook that opens DatePicker in a BottomSheet (iOS modal UX)
 *
 * WheelPicker features:
 *   - CSS scroll-snap (y mandatory, item-center) — native momentum on all platforms
 *   - 5 visible items, 44px each (Apple HIG touch target)
 *   - Fog gradient at top/bottom obscures non-selected items (iOS drum-roll look)
 *   - Hairline selection indicator lines above/below centre item
 *   - hapticSelection() fires on each new item that enters the centre
 *   - Keyboard: ↑ / ↓ arrow keys step through items
 *   - role="listbox" + role="option" + aria-selected for accessibility
 *
 * DatePicker features:
 *   - mode: "date" | "time" | "datetime"
 *   - min / max Date constraints
 *   - Localized month names (Intl.DateTimeFormat)
 *   - onChange fires with the full updated Date
 *
 * useDatePicker:
 *   - Hook that opens DatePicker inside a BottomSheet
 *   - Confirms on Done button, cancels on sheet dismiss
 *
 * Usage:
 * ```tsx
 * // Standalone WheelPicker
 * <WheelPicker
 *   items={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
 *           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
 *   value="Mar"
 *   onChange={setMonth}
 * />
 *
 * // DatePicker inline
 * <DatePicker
 *   mode="date"
 *   value={date}
 *   onChange={setDate}
 *   min={new Date('2020-01-01')}
 *   max={new Date('2030-12-31')}
 * />
 *
 * // BottomSheet variant
 * const { open, value } = useDatePicker({ mode: 'date', initialValue: new Date() });
 * <Button onClick={open}>Pick a date</Button>
 * ```
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { hapticSelection } from './haptics';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

// ── Constants ─────────────────────────────────────────────────────────────────

const ITEM_H       = 44;    // px per item — Apple HIG touch target
const VISIBLE_CNT  = 5;     // visible items in the drum
const PICKER_H     = ITEM_H * VISIBLE_CNT;  // 220px total height
const PAD_ITEMS    = Math.floor(VISIBLE_CNT / 2);  // 2

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WheelPickerItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface WheelPickerProps {
  items: (WheelPickerItem | string)[];
  value: string;
  onChange: (value: string) => void;
  /** Column width in px. Default: auto (flex:1). */
  width?: number;
  /** aria-label for the listbox. */
  'aria-label'?: string;
  className?: string;
}

export type DatePickerMode = 'date' | 'time' | 'datetime';

export interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: DatePickerMode;
  min?: Date;
  max?: Date;
  /** Locale for month names. Default: browser locale. */
  locale?: string;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normaliseItem(raw: WheelPickerItem | string): WheelPickerItem {
  if (typeof raw === 'string') return { value: raw, label: raw };
  return raw;
}

function pad2(n: number) { return String(n).padStart(2, '0'); }

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ── WheelPicker ───────────────────────────────────────────────────────────────

export function WheelPicker({
  items: rawItems,
  value,
  onChange,
  width,
  'aria-label': ariaLabel = 'Picker',
  className = '',
}: WheelPickerProps) {
  const items     = rawItems.map(normaliseItem);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIdx   = useRef(-1);      // to detect index changes
  const isScrolling = useRef(false); // suppress programmatic scroll feedback

  // ── Scroll to value ─────────────────────────────────────────────────────────

  const scrollToIndex = useCallback((idx: number, behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (!el) return;
    isScrolling.current = true;
    el.scrollTo({ top: idx * ITEM_H, behavior });
    setTimeout(() => { isScrolling.current = false; }, 400);
  }, []);

  // Sync scroll position when `value` prop changes
  useEffect(() => {
    const idx = items.findIndex(i => i.value === value);
    if (idx < 0) return;
    scrollToIndex(idx, lastIdx.current < 0 ? 'instant' : 'smooth');
    lastIdx.current = idx;
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Detect selection from scroll position ───────────────────────────────────

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const rawIdx = Math.round(el.scrollTop / ITEM_H);
    const idx    = clamp(rawIdx, 0, items.length - 1);
    if (idx === lastIdx.current) return;
    const item = items[idx];
    if (item?.disabled) return;
    lastIdx.current = idx;
    if (!isScrolling.current) hapticSelection();
    onChange(item.value);
  }, [items, onChange]);

  // Fallback: debounced scroll end for browsers without scrollend event
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onScroll = useCallback(() => {
    handleScroll();
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(handleScroll, 120);
  }, [handleScroll]);

  // ── Keyboard navigation ─────────────────────────────────────────────────────

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIdx = items.findIndex(i => i.value === value);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = clamp(currentIdx + 1, 0, items.length - 1);
      onChange(items[next].value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = clamp(currentIdx - 1, 0, items.length - 1);
      onChange(items[prev].value);
    }
  }, [items, value, onChange]);

  // ── Render ──────────────────────────────────────────────────────────────────

  const selectedIdx = items.findIndex(i => i.value === value);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        height:   PICKER_H,
        width:    width ?? undefined,
        flex:     width ? undefined : 1,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* ── Fog gradients (top + bottom) ─────────────────────────────────── */}
      <div style={{
        position:       'absolute',
        top:            0,
        left:           0,
        right:          0,
        height:         ITEM_H * PAD_ITEMS,
        background:     `linear-gradient(to bottom, var(--surface-solid) 20%, transparent)`,
        zIndex:         2,
        pointerEvents:  'none',
      }} aria-hidden="true" />
      <div style={{
        position:       'absolute',
        bottom:         0,
        left:           0,
        right:          0,
        height:         ITEM_H * PAD_ITEMS,
        background:     `linear-gradient(to top, var(--surface-solid) 20%, transparent)`,
        zIndex:         2,
        pointerEvents:  'none',
      }} aria-hidden="true" />

      {/* ── Selection indicator ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:   'absolute',
          top:        ITEM_H * PAD_ITEMS,
          left:       0,
          right:      0,
          height:     ITEM_H,
          borderTop:    '1px solid var(--surface-divider)',
          borderBottom: '1px solid var(--surface-divider)',
          zIndex:     2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Scrollable drum ─────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={handleKeyDown}
        style={{
          height:                  PICKER_H,
          overflowY:               'scroll',
          scrollSnapType:          'y mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingTop:              ITEM_H * PAD_ITEMS,
          paddingBottom:           ITEM_H * PAD_ITEMS,
          outline:                 'none',
          // Hide scrollbar (cross-browser)
          scrollbarWidth:          'none',
          msOverflowStyle:         'none',
        } as React.CSSProperties}
      >
        {items.map((item, i) => {
          const isSel = i === selectedIdx;
          return (
            <div
              key={item.value}
              role="option"
              aria-selected={isSel}
              aria-disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                scrollToIndex(i);
                onChange(item.value);
              }}
              style={{
                height:         ITEM_H,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                scrollSnapAlign:'center',
                fontSize:       isSel ? 20 : 17,
                fontWeight:     isSel ? 600 : 400,
                color:          item.disabled
                  ? 'var(--color-muted)'
                  : isSel
                  ? 'var(--color-ink)'
                  : 'color-mix(in srgb, var(--color-ink) 55%, transparent)',
                transition:     'font-size 120ms ease, color 120ms ease',
                cursor:         item.disabled ? 'not-allowed' : 'pointer',
                paddingInline:  12,
                textAlign:      'center',
                whiteSpace:     'nowrap',
              } as React.CSSProperties}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DatePicker helpers ────────────────────────────────────────────────────────

function getMonthNames(locale?: string): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2000, i, 1))
  );
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function buildRange(lo: number, hi: number): string[] {
  return Array.from({ length: hi - lo + 1 }, (_, i) => String(lo + i));
}

// ── DatePicker ────────────────────────────────────────────────────────────────

export function DatePicker({
  value,
  onChange,
  mode = 'date',
  min,
  max,
  locale,
  className = '',
}: DatePickerProps) {

  const monthNames = getMonthNames(locale);

  // ── Column values ────────────────────────────────────────────────────────────

  const year  = value.getFullYear();
  const month = value.getMonth();     // 0-indexed
  const day   = value.getDate();
  const hours = value.getHours();
  const mins  = value.getMinutes();

  // Year range
  const minYear = min?.getFullYear() ?? year - 50;
  const maxYear = max?.getFullYear() ?? year + 50;
  const years   = buildRange(minYear, maxYear);

  // Month names
  const months = monthNames.map((label, i) => ({
    value: String(i),
    label,
  }));

  // Days (clamp to days-in-month)
  const daysInMonth = getDaysInMonth(year, month);
  const days = buildRange(1, daysInMonth).map(d => ({ value: d, label: d }));

  // Hours + minutes
  const hoursItems = Array.from({ length: 24 }, (_, i) => ({
    value: String(i), label: pad2(i),
  }));
  const minsItems = Array.from({ length: 60 }, (_, i) => ({
    value: String(i), label: pad2(i),
  }));

  // ── Change handlers ──────────────────────────────────────────────────────────

  const update = (patch: Partial<{ y: number; m: number; d: number; h: number; min: number }>) => {
    const y   = patch.y   ?? year;
    const m   = patch.m   ?? month;
    const dIn = getDaysInMonth(y, m);
    const d   = clamp(patch.d ?? day, 1, dIn);
    const h   = patch.h   ?? hours;
    const mn  = patch.min ?? mins;
    const next = new Date(value);
    next.setFullYear(y);
    next.setMonth(m);
    next.setDate(d);
    next.setHours(h);
    next.setMinutes(mn);
    onChange(next);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      className={className}
      style={{
        display:         'flex',
        flexDirection:   'row',
        alignItems:      'stretch',
        background:      'var(--surface-solid)',
        borderRadius:    16,
        overflow:        'hidden',
        height:          PICKER_H,
      }}
    >
      {(mode === 'date' || mode === 'datetime') && (
        <>
          {/* Month */}
          <WheelPicker
            items={months}
            value={String(month)}
            onChange={v => update({ m: Number(v) })}
            aria-label="Month"
          />
          {/* Day */}
          <WheelPicker
            items={days}
            value={String(day)}
            onChange={v => update({ d: Number(v) })}
            aria-label="Day"
            width={56}
          />
          {/* Year */}
          <WheelPicker
            items={years}
            value={String(year)}
            onChange={v => update({ y: Number(v) })}
            aria-label="Year"
            width={80}
          />
        </>
      )}

      {mode === 'datetime' && (
        <div style={{
          width: 1, background: 'var(--surface-divider)',
          alignSelf: 'stretch', flexShrink: 0,
        }} />
      )}

      {(mode === 'time' || mode === 'datetime') && (
        <>
          {/* Hour */}
          <WheelPicker
            items={hoursItems}
            value={String(hours)}
            onChange={v => update({ h: Number(v) })}
            aria-label="Hour"
            width={56}
          />
          {/* Minute */}
          <WheelPicker
            items={minsItems}
            value={String(mins)}
            onChange={v => update({ min: Number(v) })}
            aria-label="Minute"
            width={56}
          />
        </>
      )}
    </div>
  );
}

// ── useDatePicker — BottomSheet variant ───────────────────────────────────────

export interface UseDatePickerOptions {
  mode?: DatePickerMode;
  initialValue?: Date;
  title?: string;
}

export interface UseDatePickerResult {
  value: Date;
  open: () => void;
  sheet: ReactNode;
}

export function useDatePicker({
  mode = 'date',
  initialValue,
  title,
}: UseDatePickerOptions = {}): UseDatePickerResult {
  const [isOpen,  setIsOpen]  = useState(false);
  const [current, setCurrent] = useState<Date>(initialValue ?? new Date());
  const [draft,   setDraft]   = useState<Date>(initialValue ?? new Date());

  const openSheet = () => {
    setDraft(current);
    setIsOpen(true);
  };

  const confirm = () => {
    setCurrent(draft);
    setIsOpen(false);
  };

  const cancel = () => {
    setDraft(current);
    setIsOpen(false);
  };

  const sheetTitle = title ?? (
    mode === 'date'     ? 'Select date'      :
    mode === 'time'     ? 'Select time'      :
    'Select date & time'
  );

  const sheet = (
    <BottomSheet open={isOpen} onClose={cancel} title={sheetTitle}>
      <div style={{ padding: '8px 16px 0' }}>
        <DatePicker mode={mode} value={draft} onChange={setDraft} />
      </div>
      <div style={{ padding: '16px' }}>
        <Button onClick={confirm} fullWidth>Done</Button>
      </div>
    </BottomSheet>
  );

  return { value: current, open: openSheet, sheet };
}
