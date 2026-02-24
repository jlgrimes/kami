import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { NavigationStack, useNavigation } from './NavigationStack';
import { z } from './tokens';

interface OverlayNavigatorContextValue {
  present: (page: ReactNode) => void;
  dismiss: () => void;
  isPresented: boolean;
}

const OverlayNavigatorContext = createContext<OverlayNavigatorContextValue | null>(null);

export function useOverlayNavigator(): OverlayNavigatorContextValue {
  const ctx = useContext(OverlayNavigatorContext);
  if (!ctx) {
    throw new Error('useOverlayNavigator must be used within <OverlayNavigatorProvider>');
  }
  return ctx;
}

function OverlayBootstrap({
  page,
  onClosed,
}: {
  page: ReactNode;
  onClosed: () => void;
}) {
  const { push, canGoBack } = useNavigation();
  const didPush = useRef(false);
  const hasOpened = useRef(false);

  useEffect(() => {
    if (didPush.current) return;
    didPush.current = true;
    // Defer one frame so NavigationStack mounts first, then push overlay page.
    requestAnimationFrame(() => push(page));
  }, [page, push]);

  useEffect(() => {
    if (!didPush.current) return;
    if (canGoBack) {
      hasOpened.current = true;
      return;
    }
    // Close only after the overlay has actually been opened once and then popped.
    if (hasOpened.current) onClosed();
  }, [canGoBack, onClosed]);

  return <div className="h-full w-full pointer-events-none" />;
}

export function OverlayNavigatorProvider({ children }: { children: ReactNode }) {
  const [overlayPage, setOverlayPage] = useState<ReactNode | null>(null);

  const dismiss = useCallback(() => setOverlayPage(null), []);
  const present = useCallback((page: ReactNode) => setOverlayPage(page), []);

  return (
    <OverlayNavigatorContext.Provider
      value={{
        present,
        dismiss,
        isPresented: overlayPage !== null,
      }}
    >
      {children}
      {overlayPage && createPortal(
        <div className="fixed inset-0" style={{ zIndex: z.sheet }}>
          <NavigationStack
            initialPage={<OverlayBootstrap page={overlayPage} onClosed={dismiss} />}
          />
        </div>,
        document.body,
      )}
    </OverlayNavigatorContext.Provider>
  );
}
