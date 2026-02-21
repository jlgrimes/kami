/**
 * ErrorBoundary — React class component to catch render errors.
 *
 * Wraps children; if any child throws during render, lifecycle, or constructor,
 * shows a friendly ErrorState UI instead of a blank crash.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={<p>Custom error</p>}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

// ── ErrorState — reusable error UI for both boundary + useAsync errors ────────

interface ErrorStateProps {
  /** Short headline (default "Something went wrong") */
  title?: string;
  /** Descriptive message or error.message */
  message?: string;
  /** Optional retry handler */
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title   = 'Something went wrong',
  message,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-12 px-6 space-y-3',
        className,
      ].join(' ')}
    >
      <span className="text-4xl select-none" aria-hidden="true">⚠️</span>
      <p className="font-bold text-[var(--color-ink)] text-base">{title}</p>
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono leading-snug max-w-xs">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className={[
            'mt-2 px-5 py-2 rounded-xl text-sm font-semibold',
            'bg-[var(--color-accent)] text-white',
            'active:opacity-70 transition-opacity',
          ].join(' ')}
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ── ErrorBoundary class component ─────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback. If omitted, renders <ErrorState>. */
  fallback?: ReactNode;
  /** Called when an error is caught (e.g. for Highlight / PostHog reporting). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);

    // Lazy-report to monitoring if available
    import('./../../lib/monitoring').then(({ reportError }) => {
      reportError(error, { componentStack: info.componentStack ?? '' });
    }).catch(() => { /* monitoring not configured */ });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <ErrorState
          title="Something went wrong"
          message={this.state.error?.message}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}
