import type { NavbarProps } from './types';
import { useNavigation, usePageDepth } from './NavigationStack';
import { useScrollToTop } from './Page';
import { hapticMedium } from '../haptics';

export function Navbar({ title, left, right }: NavbarProps) {
  const { pop }    = useNavigation();
  const depth      = usePageDepth();
  const scrollToTop = useScrollToTop();
  const showBack   = depth > 0;

  const backButton = (
    <button
      onClick={() => { hapticMedium(); pop(); }}
      className="flex items-center gap-1 text-[var(--color-accent)] font-mono text-xs tracking-wider min-h-[44px] min-w-[44px] active:opacity-40 transition-opacity"
    >
      ← back
    </button>
  );

  return (
    <header
      className="shrink-0 bg-[var(--surface-bg)] backdrop-blur-2xl flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="h-11 flex items-center px-3 gap-1">
        <div className="w-24 flex items-center">
          {left !== undefined ? left : showBack ? backButton : null}
        </div>

        {/* Title — tap to scroll to top (iOS convention) */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={scrollToTop}
            className="text-[15px] font-semibold text-[var(--color-ink)] truncate active:opacity-60 transition-opacity"
          >
            {title}
          </button>
        </div>

        <div className="w-24 flex items-center justify-end">
          {right}
        </div>
      </div>
      <div className="h-px bg-[var(--surface-divider)]" />
    </header>
  );
}
