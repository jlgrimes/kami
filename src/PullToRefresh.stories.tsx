/**
 * PullToRefresh stories.
 * Test on a mobile device or in DevTools device mode — pull gesture requires touch events.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PullToRefresh } from './PullToRefresh';

const meta: Meta<typeof PullToRefresh> = {
  title: 'UI/PullToRefresh',
  component: PullToRefresh,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Pull-to-refresh requires touch events — test on a mobile device or use DevTools device simulation.',
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PullToRefresh>;

// ── Sample list item ──────────────────────────────────────────────────────────

function FakeItem({ index, fresh }: { index: number; fresh: boolean }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: '1px solid var(--surface-divider)',
      display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 20,
        background: `hsl(${(index * 47) % 360}, 60%, 80%)`,
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-ink)' }}>
          Item {fresh ? '🆕' : ''} #{index + 1}
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
          {fresh ? 'Freshly loaded' : 'Pull down to refresh'}
        </div>
      </div>
    </div>
  );
}

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default (pull to refresh — touch only)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [refreshCount, setRefreshCount] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [fresh, setFresh] = useState(false);

    const onRefresh = async () => {
      // Simulate network request
      await new Promise<void>(r => setTimeout(r, 1800));
      setRefreshCount(c => c + 1);
      setFresh(true);
      setTimeout(() => setFresh(false), 3000);
    };

    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 16px 8px', background: 'var(--color-paper)', flexShrink: 0 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>
            Feed
          </h2>
          {refreshCount > 0 && (
            <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>
              Refreshed {refreshCount}×
            </p>
          )}
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
            Pull down on the list below (touch device only)
          </p>
        </div>

        <PullToRefresh onRefresh={onRefresh} style={{ flex: 1 }}>
          <div>
            {Array.from({ length: 20 }, (_, i) => (
              <FakeItem key={`${refreshCount}-${i}`} index={i} fresh={fresh && i < 3} />
            ))}
          </div>
        </PullToRefresh>
      </div>
    );
  },
};

export const WithSlowRefresh: Story = {
  name: 'Slow refresh (3s)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [items, setItems] = useState(['Lesson 1', 'Lesson 2', 'Lesson 3']);

    const onRefresh = async () => {
      await new Promise<void>(r => setTimeout(r, 3000));
      setItems(prev => [`New item ${Date.now() % 1000}`, ...prev]);
    };

    return (
      <div style={{ height: '100dvh' }}>
        <PullToRefresh onRefresh={onRefresh}>
          <div style={{ padding: 16 }}>
            {items.map((item, i) => (
              <div key={`${item}-${i}`} style={{
                padding: '14px 0',
                borderBottom: '1px solid var(--surface-divider)',
                fontSize: 15,
                color: 'var(--color-ink)',
                fontWeight: i === 0 && items[0].startsWith('New') ? 700 : 500,
              }}>
                {i === 0 && items[0].startsWith('New') ? '🆕 ' : ''}{item}
              </div>
            ))}
          </div>
        </PullToRefresh>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ height: '100dvh' }}>
      <PullToRefresh onRefresh={async () => {}} disabled>
        <div style={{ padding: 16 }}>
          <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>
            Pull-to-refresh is disabled — pull gesture has no effect.
          </p>
          {Array.from({ length: 10 }, (_, i) => (
            <FakeItem key={i} index={i} fresh={false} />
          ))}
        </div>
      </PullToRefresh>
    </div>
  ),
};
