import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityIndicator } from './ActivityIndicator';
import { Button } from './Button';

const meta: Meta<typeof ActivityIndicator> = {
  title: 'UI/ActivityIndicator',
  component: ActivityIndicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size:  { control: 'radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
  },
};
export default meta;
type Story = StoryObj<typeof ActivityIndicator>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { size: 'md' },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <ActivityIndicator size={size} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'gray' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colours: Story = {
  name: 'Colour variants',
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <ActivityIndicator color="var(--color-accent)" aria-label="Accent spinner" />
      <ActivityIndicator color="var(--color-success)" aria-label="Success spinner" />
      <ActivityIndicator color="var(--color-warning)" aria-label="Warning spinner" />
      <ActivityIndicator color="var(--color-ink)" aria-label="Ink spinner" />
      <ActivityIndicator color="var(--color-muted)" aria-label="Muted spinner" />
    </div>
  ),
};

export const InlineInButton: Story = {
  name: 'Button loading state',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState(false);
    const handleSubmit = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2500);
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Button loading={loading} onClick={handleSubmit}>
          Save changes
        </Button>
        <Button variant="secondary" loading={loading} onClick={handleSubmit}>
          Secondary loading
        </Button>
        <Button variant="ghost" loading={loading} onClick={handleSubmit}>
          Ghost loading
        </Button>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          Tap a button — observe spinner, stable width, double-submit prevented
        </p>
      </div>
    );
  },
};

export const InlineInList: Story = {
  name: 'Inline in list row',
  render: () => (
    <div style={{
      background: 'var(--surface-solid, white)', borderRadius: 16,
      overflow: 'hidden', boxShadow: 'var(--shadow-sm)', width: 320,
    }}>
      {['Loading lesson…', 'Fetching progress…'].map((label, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderTop: i > 0 ? '1px solid var(--surface-divider)' : undefined,
        }}>
          <span style={{ fontSize: 15, color: 'var(--color-ink)' }}>{label}</span>
          <ActivityIndicator size="sm" color="var(--color-muted)" />
        </div>
      ))}
    </div>
  ),
};

export const FullScreenOverlay: Story = {
  name: 'ActivityIndicator.Overlay',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [visible, setVisible] = useState(false);

    const show = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Button onClick={show}>Show overlay (2.5s)</Button>
        <ActivityIndicator.Overlay visible={visible} label="Syncing…" />
      </div>
    );
  },
};

export const OverlayNoLabel: Story = {
  name: 'Overlay — no label',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [visible, setVisible] = useState(false);
    return (
      <div>
        <Button onClick={() => { setVisible(true); setTimeout(() => setVisible(false), 2000); }}>
          Show spinner overlay
        </Button>
        <ActivityIndicator.Overlay visible={visible} />
      </div>
    );
  },
};

export const ReducedMotion: Story = {
  name: 'Reduced motion (add .kami-spinner class)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <p style={{ fontSize: 12, color: 'gray', textAlign: 'center', maxWidth: 240 }}>
        When prefers-reduced-motion is enabled, the CSS swaps the spin
        animation for a gentle pulse (via the <code>.kami-spinner</code> class).
      </p>
      <ActivityIndicator size="lg" />
    </div>
  ),
};
