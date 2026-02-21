import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant:   { control: 'radio',   options: ['default', 'error', 'offline', 'search'] },
    contained: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title:    'Nothing here yet',
    subtitle: 'Your saved items will appear here.',
  },
};

export const WithAction: Story = {
  name: 'With action button',
  args: {
    icon:     '📭',
    title:    'Nothing saved yet',
    subtitle: 'Tap the bookmark icon on any phrase to save it here.',
    action:   { label: 'Browse lessons', onPress: () => {} },
  },
};

export const WithGhostAction: Story = {
  name: 'With ghost action',
  args: {
    icon:     '🔖',
    title:    'No bookmarks',
    subtitle: 'Start bookmarking phrases you want to revisit.',
    action:   { label: 'Go to lessons', onPress: () => {}, variant: 'ghost' },
  },
};

export const ErrorVariant: Story = {
  name: 'Error variant',
  args: {
    variant:  'error',
    title:    'Something went wrong',
    subtitle: "We couldn't load your data. Please check your connection.",
    action:   { label: 'Try again', onPress: () => {} },
  },
};

export const OfflineVariant: Story = {
  name: 'Offline variant',
  args: {
    variant:  'offline',
    title:    "You're offline",
    subtitle: 'Your progress is saved. Connect to sync with the cloud.',
    action:   { label: 'Retry connection', onPress: () => {}, variant: 'ghost' },
  },
};

export const SearchVariant: Story = {
  name: 'Search — no results',
  args: {
    variant:  'search',
    title:    'No results',
    subtitle: 'Try different keywords or check your spelling.',
    contained: true,
  },
};

export const Contained: Story = {
  name: 'Contained (in a card)',
  render: () => (
    <div style={{
      background:   'var(--surface-solid, white)',
      borderRadius: 20,
      boxShadow:    'var(--shadow-sm)',
      overflow:     'hidden',
      maxWidth:     380,
    }}>
      <div style={{ padding: '16px 16px 0', fontWeight: 700, fontSize: 17, color: 'var(--color-ink)' }}>
        Recent activity
      </div>
      <EmptyState
        icon="🗓️"
        title="No recent activity"
        subtitle="Complete a quiz or lesson to see your progress here."
        contained
        action={{ label: 'Start a lesson', onPress: () => {} }}
      />
    </div>
  ),
};

export const NoIcon: Story = {
  name: 'No icon',
  args: {
    icon:     undefined,
    title:    'No notifications',
    subtitle: "You're all caught up!",
  },
};

export const CustomIcon: Story = {
  name: 'Custom SVG icon',
  render: () => (
    <EmptyState
      icon={
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="28" fill="var(--input-bg)" />
          <path
            d="M18 28c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S18 33.523 18 28z"
            stroke="var(--color-muted)" strokeWidth="2" fill="none"
          />
          <circle cx="28" cy="28" r="3" fill="var(--color-muted)" />
        </svg>
      }
      title="Nothing to see here"
      subtitle="Move along."
    />
  ),
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {(['default', 'error', 'offline', 'search'] as const).map(variant => (
        <div key={variant} style={{
          background: 'var(--surface-solid, white)',
          borderRadius: 16,
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden',
        }}>
          <EmptyState
            variant={variant}
            title={variant.charAt(0).toUpperCase() + variant.slice(1)}
            subtitle="This is the subtitle text."
            contained
          />
        </div>
      ))}
    </div>
  ),
};
