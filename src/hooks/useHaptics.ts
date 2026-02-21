/**
 * useHaptics — unified haptic feedback hook.
 *
 * Wraps @capacitor/haptics with a stable, ergonomic API.
 * Automatically no-ops in browser environments where Capacitor
 * is not available — no error handling required at the call site.
 *
 * API:
 * ```ts
 * const haptics = useHaptics();
 *
 * // Impact (physical feedback — most common)
 * haptics.impact('light');    // button taps, selections
 * haptics.impact('medium');   // confirmations, toggles
 * haptics.impact('heavy');    // destructive actions
 *
 * // Notification (pattern feedback)
 * haptics.notification('success');  // task complete
 * haptics.notification('warning');  // caution prompt
 * haptics.notification('error');    // failure
 *
 * // Selection (subtle tick — picker scrolling, segment change)
 * haptics.selection();
 * ```
 *
 * Notes:
 * - The returned object reference is stable across renders (useMemo).
 * - All methods are async fire-and-forget — they return void.
 * - When running on web without Capacitor, all methods silently no-op.
 */

import { useMemo } from 'react';
import {
  hapticLight,
  hapticMedium,
  hapticHeavy,
  hapticSuccess,
  hapticWarning,
  hapticError,
  hapticSelection,
} from '../haptics';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ImpactLevel       = 'light' | 'medium' | 'heavy';
export type NotificationType2 = 'success' | 'warning' | 'error';

export interface HapticsAPI {
  /**
   * Physical impact feedback. Use for:
   * - 'light'  → button taps, chip selection, routine interactions
   * - 'medium' → switch toggles, confirmations, modal open
   * - 'heavy'  → destructive actions, force-press, significant events
   */
  impact(level: ImpactLevel): void;

  /**
   * Notification pattern feedback. Use for:
   * - 'success' → task complete, save confirmed, auth success
   * - 'warning' → caution dialogs, rate limiting
   * - 'error'   → validation failure, network error
   */
  notification(type: NotificationType2): void;

  /**
   * Selection tick. Use for:
   * - Picker/wheel scrolling (each detent)
   * - Segmented control change
   * - Any subtle "click" moment in continuous interaction
   */
  selection(): void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useHaptics(): HapticsAPI {
  return useMemo<HapticsAPI>(() => ({
    impact(level: ImpactLevel) {
      switch (level) {
        case 'light':  hapticLight();  break;
        case 'medium': hapticMedium(); break;
        case 'heavy':  hapticHeavy();  break;
      }
    },

    notification(type: NotificationType2) {
      switch (type) {
        case 'success': hapticSuccess(); break;
        case 'warning': hapticWarning(); break;
        case 'error':   hapticError();   break;
      }
    },

    selection() {
      hapticSelection();
    },
  }), []); // stable — no deps, no re-allocation on re-render
}
