import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';

// ── Scroll-to-top context ─────────────────────────────────────────────────────
// Page provides a stable ref; PageContent registers its scroll fn into it;
// Navbar (sibling of PageContent) reads from it via useScrollToTop().

const ScrollFnContext = createContext<React.MutableRefObject<() => void> | null>(null);

export function useScrollToTop() {
  const ref = useContext(ScrollFnContext);
  return () => ref?.current?.();
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface PageProps {
  children: ReactNode;
  className?: string;
}

export function Page({ children, className = '' }: PageProps) {
  const scrollFnRef = useRef<() => void>(() => {});
  return (
    <ScrollFnContext.Provider value={scrollFnRef}>
      <div className={`h-full flex flex-col bg-[var(--color-paper)] ${className}`}>
        {children}
      </div>
    </ScrollFnContext.Provider>
  );
}

// ── PageContent ───────────────────────────────────────────────────────────────

export function PageContent({ children, className = '' }: PageProps) {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const scrollFnRef = useContext(ScrollFnContext);

  // Register scroll fn so Navbar can call it
  useEffect(() => {
    if (!scrollFnRef) return;
    scrollFnRef.current = () =>
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { if (scrollFnRef) scrollFnRef.current = () => {}; };
  }, [scrollFnRef]);

  return (
    <div
      ref={scrollRef}
      className={`flex-1 overflow-y-auto overscroll-contain ${className}`}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}
    >
      {children}
    </div>
  );
}
