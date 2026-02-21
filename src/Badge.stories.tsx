import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'muted'],
    },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'default', variant: 'default', size: 'md' },
};

export const Primary: Story = { args: { children: 'primary', variant: 'primary' } };
export const Success: Story = { args: { children: 'done', variant: 'success' } };
export const Warning: Story = { args: { children: 'caution', variant: 'warning' } };
export const Danger: Story  = { args: { children: '99+', variant: 'danger' } };
export const Muted: Story   = { args: { children: 'NEW', variant: 'muted' } };

export const AllVariantsMd: Story = {
  name: 'All variants — md',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(['default', 'primary', 'success', 'warning', 'danger', 'muted'] as const).map(v => (
        <Badge key={v} variant={v}>{v}</Badge>
      ))}
    </div>
  ),
};

export const AllVariantsSm: Story = {
  name: 'All variants — sm',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(['default', 'primary', 'success', 'warning', 'danger', 'muted'] as const).map(v => (
        <Badge key={v} variant={v} size="sm">{v}</Badge>
      ))}
    </div>
  ),
};

export const WithCounts: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge variant="primary">3</Badge>
      <Badge variant="danger">99+</Badge>
      <Badge variant="success">✓</Badge>
      <Badge variant="muted" size="sm">NEW</Badge>
    </div>
  ),
};
