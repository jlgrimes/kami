import { useEffect, type ReactNode } from 'react';

interface AppViewportProviderProps {
  children: ReactNode;
  lockZoom?: boolean;
}

function setAppHeight() {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const appHeight = `${Math.round(viewportHeight)}px`;

  document.documentElement.style.setProperty('--app-height', appHeight);

  const root = document.getElementById('root');
  if (root) {
    root.style.height = 'var(--app-height)';
    root.style.overflow = 'hidden';
  }

  document.documentElement.style.height = 'var(--app-height)';
  document.body.style.height = 'var(--app-height)';
  document.body.style.overflow = 'hidden';
}

export function AppViewportProvider({
  children,
  lockZoom = true,
}: AppViewportProviderProps) {
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewport = viewportMeta?.getAttribute('content') ?? null;
    const root = document.getElementById('root');
    const originalRootHeight = root?.style.height ?? '';
    const originalRootOverflow = root?.style.overflow ?? '';
    const originalHtmlHeight = document.documentElement.style.height;
    const originalBodyHeight = document.body.style.height;
    const originalBodyOverflow = document.body.style.overflow;

    if (lockZoom) {
      const content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      if (viewportMeta) {
        viewportMeta.setAttribute('content', content);
      }
    }

    const handleGesture = (event: Event) => event.preventDefault();
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) event.preventDefault();
    };

    if (lockZoom) {
      document.addEventListener('gesturestart', handleGesture, { passive: false });
      document.addEventListener('gesturechange', handleGesture, { passive: false });
      document.addEventListener('gestureend', handleGesture, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.visualViewport?.addEventListener('resize', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.visualViewport?.removeEventListener('resize', setAppHeight);

      if (lockZoom) {
        document.removeEventListener('gesturestart', handleGesture);
        document.removeEventListener('gesturechange', handleGesture);
        document.removeEventListener('gestureend', handleGesture);
        document.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('wheel', handleWheel);
      }

      if (viewportMeta && originalViewport) viewportMeta.setAttribute('content', originalViewport);
      if (root) {
        root.style.height = originalRootHeight;
        root.style.overflow = originalRootOverflow;
      }
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.height = originalBodyHeight;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [lockZoom]);

  return <>{children}</>;
}
