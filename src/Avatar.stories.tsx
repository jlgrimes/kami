import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size:    { control: 'radio',   options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    online:  { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { name: 'Jared Grimes', size: 'md' },
};

export const WithImage: Story = {
  name: 'With image',
  args: {
    src:  'https://api.dicebear.com/9.x/avataaars/svg?seed=kami',
    name: 'Kami User',
    size: 'lg',
  },
};

export const ImageFallback: Story = {
  name: 'Image with broken src → initials fallback',
  args: {
    src:  'https://broken-url.example.com/avatar.jpg',
    name: 'Broken Image',
    size: 'lg',
  },
};

export const Online: Story = {
  name: 'Online indicator',
  args: { name: 'Alice Wang', size: 'md', online: true },
};

export const Loading: Story = {
  name: 'Loading skeleton',
  args: { loading: true, size: 'md' },
};

export const Pressable: Story = {
  name: 'Pressable (tap me)',
  render: () => (
    <Avatar
      name="Tap Me"
      size="lg"
      // eslint-disable-next-line no-alert
      onClick={() => alert('Avatar tapped!')}
    />
  ),
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Avatar name="Jared Grimes" size={size} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'gray' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllSizesOnline: Story = {
  name: 'All sizes — online',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Avatar name="Jared Grimes" size={size} online />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'gray' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const InitialsColors: Story = {
  name: 'Initials colour palette (deterministic)',
  render: () => {
    const names = [
      'Alice Walker', 'Bob Tanaka', 'Clara Patel', 'Diego Ramirez',
      'Eve Nakamura', 'Frank Osei', 'Grace Kim', 'Hiro Suzuki',
    ];
    return (
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {names.map(name => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Avatar name={name} size="md" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'gray', textAlign: 'center' }}>
              {name.split(' ').map(w => w[0]).join('')}
            </span>
          </div>
        ))}
      </div>
    );
  },
};

export const LoadingStates: Story = {
  name: 'Loading states (all sizes)',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <Avatar key={size} loading size={size} />
      ))}
    </div>
  ),
};

export const Group: Story = {
  name: 'AvatarGroup — overlapping stack',
  render: () => {
    const names = ['Alice Walker', 'Bob Tanaka', 'Clara Patel', 'Diego Ramirez'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'gray', marginBottom: 8 }}>sm size, 4 members</p>
          <AvatarGroup size="sm">
            {names.map(n => <Avatar key={n} name={n} size="sm" />)}
          </AvatarGroup>
        </div>
        <div>
          <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'gray', marginBottom: 8 }}>md + overflow count</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AvatarGroup size="md">
              {names.slice(0, 3).map(n => <Avatar key={n} name={n} size="md" />)}
            </AvatarGroup>
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: 'var(--color-muted)',
              marginLeft: 4,
            }}>
              +{names.length - 3} more
            </span>
          </div>
        </div>
      </div>
    );
  },
};

/** Realistic conversation header */
export const InContext: Story = {
  name: 'In context — conversation header',
  render: () => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      background: 'var(--surface-solid, white)',
      borderRadius: 16,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <Avatar name="山田 太郎" size="md" online />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
          山田 太郎
        </p>
        <p style={{ fontSize: 12, color: 'var(--color-success)', margin: '2px 0 0' }}>
          Online
        </p>
      </div>
      <Avatar
        name="You"
        size="sm"
        onClick={() => {}}
      />
    </div>
  ),
};
