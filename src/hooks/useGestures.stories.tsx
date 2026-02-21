/**
 * Gesture hook demos — usePan, usePinch, useLongPress
 * Touch a mobile device or use DevTools device simulation to test.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { usePan, usePinch, useLongPress } from './useGestures';

// ── usePan demo ───────────────────────────────────────────────────────────────

function PanDemo() {
  const [state, setState] = useState({ dx: 0, dy: 0, vx: 0, vy: 0, active: false });

  const ref = usePan({
    onStart: ()    => setState(s => ({ ...s, active: true, dx: 0, dy: 0 })),
    onMove:  s     => setState({ dx: s.dx, dy: s.dy, vx: s.vx, vy: s.vy, active: true }),
    onEnd:   s     => setState({ dx: s.dx, dy: s.dy, vx: s.vx, vy: s.vy, active: false }),
  }) as React.RefObject<HTMLDivElement>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        ref={ref}
        style={{
          width: '100%', height: 180,
          background: 'var(--input-bg)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: 'none',
          cursor: 'grab',
          userSelect: 'none',
          border: state.active ? '2px solid var(--color-accent)' : '2px solid transparent',
          transition: 'border-color 100ms',
        }}
      >
        <p style={{ fontSize: 14, color: 'var(--color-muted)', textAlign: 'center' }}>
          {state.active ? '👆 Dragging…' : 'Drag / pan this area'}
        </p>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 2, color: 'var(--color-muted)' }}>
        <div>dx: <strong style={{ color: 'var(--color-ink)' }}>{Math.round(state.dx)}px</strong></div>
        <div>dy: <strong style={{ color: 'var(--color-ink)' }}>{Math.round(state.dy)}px</strong></div>
        <div>vx: <strong style={{ color: 'var(--color-ink)' }}>{state.vx.toFixed(3)} px/ms</strong></div>
        <div>vy: <strong style={{ color: 'var(--color-ink)' }}>{state.vy.toFixed(3)} px/ms</strong></div>
      </div>
    </div>
  );
}

// ── usePinch demo ─────────────────────────────────────────────────────────────

function PinchDemo() {
  const [scale, setScale]   = useState(1);
  const [origin, setOrigin] = useState<[number, number]>([0, 0]);

  const ref = usePinch({
    onMove: s => { setScale(s.scale); setOrigin(s.origin); },
    onEnd:  () => setScale(1),
  }) as React.RefObject<HTMLDivElement>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        ref={ref}
        style={{
          width: '100%', height: 200,
          background: 'var(--input-bg)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: 'none',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        <div style={{
          fontSize: 48,
          transform: `scale(${scale})`,
          transformOrigin: `${origin[0]}px ${origin[1]}px`,
          transition: scale === 1 ? 'transform 0.3s ease' : undefined,
        }}>
          🗾
        </div>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 2, color: 'var(--color-muted)' }}>
        <div>scale: <strong style={{ color: 'var(--color-ink)' }}>{scale.toFixed(3)}</strong></div>
        <div>origin: <strong style={{ color: 'var(--color-ink)' }}>[{Math.round(origin[0])}, {Math.round(origin[1])}]</strong></div>
      </div>
      <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>
        Use two fingers (or DevTools touch simulation) to pinch.
      </p>
    </div>
  );
}

// ── useLongPress demo ─────────────────────────────────────────────────────────

function LongPressDemo() {
  const [count,    setCount]    = useState(0);
  const [holding,  setHolding]  = useState(false);
  const [progress, setProgress] = useState(0);

  const ref = useLongPress({
    onLongPress: () => { setCount(c => c + 1); setHolding(false); setProgress(0); },
    delay:  500,
    haptic: true,
  }) as React.RefObject<HTMLButtonElement>;

  // Visual progress ring — purely cosmetic, driven by CSS animation on hold
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <button
        ref={ref}
        onPointerDown={() => { setHolding(true); setProgress(0); }}
        onPointerUp={()   => { setHolding(false); setProgress(0); }}
        style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: holding ? 'var(--color-accent)' : 'var(--input-bg)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s ease, transform 0.1s ease',
          transform: holding ? 'scale(0.94)' : 'scale(1)',
          touchAction: 'none',
          userSelect: 'none',
          boxShadow: holding ? '0 4px 20px rgba(230,57,70,0.3)' : 'none',
        }}
      >
        {holding ? '⏳' : '👆'}
      </button>
      <p style={{ fontSize: 14, color: 'var(--color-ink)', textAlign: 'center', margin: 0 }}>
        Hold 500ms to trigger
      </p>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
        Triggered: <strong style={{ color: 'var(--color-ink)' }}>{count}</strong> time{count !== 1 ? 's' : ''}
      </p>
      <p style={{ fontSize: 11, color: '#aaa', margin: 0, textAlign: 'center' }}>
        Moves &gt;10px cancel the timer. Haptic fires on trigger (device only).
      </p>
      {/* Suppress unused warning */}
      <span style={{ display: 'none' }}>{progress}</span>
    </div>
  );
}

// ── Stories ───────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Hooks/useGestures',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Pan: Story = {
  name: 'usePan — drag delta + velocity',
  render: () => <PanDemo />,
};

export const Pinch: Story = {
  name: 'usePinch — two-finger scale',
  render: () => <PinchDemo />,
};

export const LongPress: Story = {
  name: 'useLongPress — 500ms hold',
  render: () => <LongPressDemo />,
};
