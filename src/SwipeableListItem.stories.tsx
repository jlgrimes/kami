/**
 * SwipeableListItem stories.
 * Swipe gesture requires touch events or DevTools device simulation.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwipeableListItem } from './SwipeableListItem';
import { List, ListItem } from './List';

const meta: Meta<typeof SwipeableListItem> = {
  title: 'UI/SwipeableListItem',
  component: SwipeableListItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Swipe gesture requires touch events — use DevTools device mode or a real device.',
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SwipeableListItem>;

// ── Shared items ──────────────────────────────────────────────────────────────

const LESSONS = [
  { id: 1, title: 'Hiragana basics',    subtitle: 'N5 · 12 cards' },
  { id: 2, title: 'て-form conjugation', subtitle: 'N4 · 24 cards' },
  { id: 3, title: 'Particles は and が',  subtitle: 'N4 · 18 cards' },
  { id: 4, title: 'Conditionals たら',   subtitle: 'N3 · 30 cards' },
];

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Swipe left → Delete + Archive',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [items, setItems] = useState(LESSONS);
    const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
    const archive = (id: number) => { console.log('archived', id); };

    return (
      <div style={{ maxWidth: 420, paddingTop: 16 }}>
        <List>
          {items.map(item => (
            <SwipeableListItem
              key={item.id}
              trailingActions={[
                {
                  label:   'Delete',
                  icon:    '🗑',
                  variant: 'destructive',
                  onPress: () => remove(item.id),
                },
                {
                  label:   'Archive',
                  icon:    '📦',
                  variant: 'secondary',
                  onPress: () => archive(item.id),
                },
              ]}
            >
              <ListItem
                title={item.title}
                subtitle={item.subtitle}
                chevron
              />
            </SwipeableListItem>
          ))}
          {items.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>
              All items deleted. Refresh to reset.
            </div>
          )}
        </List>
        <p style={{ padding: '8px 16px', fontSize: 11, color: 'gray' }}>
          Swipe any row left to reveal Delete + Archive
        </p>
      </div>
    );
  },
};

export const LeadingActions: Story = {
  name: 'Swipe right → Pin / Mark read',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pinned, setPinned] = useState<number[]>([]);

    return (
      <div style={{ maxWidth: 420, paddingTop: 16 }}>
        <List>
          {LESSONS.map(item => (
            <SwipeableListItem
              key={item.id}
              leadingActions={[
                {
                  label:   pinned.includes(item.id) ? 'Unpin' : 'Pin',
                  icon:    '📌',
                  variant: 'primary',
                  onPress: () =>
                    setPinned(prev =>
                      prev.includes(item.id)
                        ? prev.filter(id => id !== item.id)
                        : [...prev, item.id]
                    ),
                },
              ]}
            >
              <ListItem
                title={`${pinned.includes(item.id) ? '📌 ' : ''}${item.title}`}
                subtitle={item.subtitle}
                chevron
              />
            </SwipeableListItem>
          ))}
        </List>
        <p style={{ padding: '8px 16px', fontSize: 11, color: 'gray' }}>
          Swipe right to pin/unpin
        </p>
      </div>
    );
  },
};

export const BothSides: Story = {
  name: 'Both leading + trailing actions',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [items, setItems] = useState(LESSONS);
    const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

    return (
      <div style={{ maxWidth: 420, paddingTop: 16 }}>
        <List>
          {items.map(item => (
            <SwipeableListItem
              key={item.id}
              leadingActions={[
                { label: 'Flag', icon: '🚩', variant: 'primary', onPress: () => {} },
              ]}
              trailingActions={[
                { label: 'Delete', icon: '🗑', variant: 'destructive', onPress: () => remove(item.id) },
              ]}
            >
              <ListItem title={item.title} subtitle={item.subtitle} chevron />
            </SwipeableListItem>
          ))}
        </List>
        <p style={{ padding: '8px 16px', fontSize: 11, color: 'gray' }}>
          ← Swipe left: Delete | Swipe right →: Flag
        </p>
      </div>
    );
  },
};

export const FullSwipe: Story = {
  name: 'Full-swipe triggers action',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [items, setItems] = useState(LESSONS);
    const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

    return (
      <div style={{ maxWidth: 420, paddingTop: 16 }}>
        <List>
          {items.map(item => (
            <SwipeableListItem
              key={item.id}
              fullSwipeEnabled
              fullSwipeThreshold={0.55}
              trailingActions={[
                { label: 'Delete', icon: '🗑', variant: 'destructive', onPress: () => remove(item.id) },
                { label: 'Later',  icon: '⏰', variant: 'secondary',   onPress: () => {} },
              ]}
            >
              <ListItem title={item.title} subtitle={item.subtitle} chevron />
            </SwipeableListItem>
          ))}
        </List>
        <p style={{ padding: '8px 16px', fontSize: 11, color: 'gray' }}>
          Swipe past 55% of the row to trigger Delete immediately
        </p>
      </div>
    );
  },
};

export const SingleAction: Story = {
  name: 'Single delete action',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [items, setItems] = useState(LESSONS);
    return (
      <div style={{ maxWidth: 420, paddingTop: 16 }}>
        <List>
          {items.map(item => (
            <SwipeableListItem
              key={item.id}
              trailingActions={[
                {
                  label: 'Delete', icon: '🗑', variant: 'destructive',
                  onPress: () => setItems(prev => prev.filter(i => i.id !== item.id)),
                },
              ]}
            >
              <ListItem title={item.title} subtitle={item.subtitle} />
            </SwipeableListItem>
          ))}
        </List>
      </div>
    );
  },
};
