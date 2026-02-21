import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Badge } from './Badge';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <p style={{ fontSize: 15, fontWeight: 600 }}>Card title</p>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
        Rounded card with border and subtle shadow. No interaction by default.
      </p>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card onClick={() => alert('Card tapped!')}>
      <p style={{ fontSize: 15, fontWeight: 600 }}>Tappable card</p>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
        Has cursor-pointer, scale-down on press, bg change on active.
      </p>
    </Card>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 15, fontWeight: 600 }}>Lesson 3</p>
        <Badge variant="success" size="sm">done</Badge>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
        て-form conjugation
      </p>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card>
        <p style={{ fontWeight: 600 }}>Static card</p>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>No onClick — purely presentational.</p>
      </Card>
      <Card onClick={() => {}}>
        <p style={{ fontWeight: 600 }}>Interactive card</p>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>Tap to trigger action.</p>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p style={{ fontWeight: 600 }}>With badge</p>
          <Badge variant="primary">3</Badge>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>Content with trailing badge.</p>
      </Card>
    </div>
  ),
};
