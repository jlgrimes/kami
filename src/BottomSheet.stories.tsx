import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

const meta: Meta<typeof BottomSheet> = {
  title: 'UI/BottomSheet',
  component: BottomSheet,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof BottomSheet>;

function BottomSheetDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open bottom sheet
      </Button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Example sheet">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
          <p style={{ fontSize: 15, color: 'var(--color-ink)' }}>
            Drag the handle down or tap the backdrop to dismiss.
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
            Spring entry animation via Web Animations API. No ResizeObserver.
            Works in Capacitor WKWebView.
          </p>
          <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
            Confirm
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

export const Default: Story = {
  render: () => <BottomSheetDemo />,
};

function NoTitleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open sheet (no title)
      </Button>
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
          <p style={{ fontSize: 15, color: 'var(--color-ink)' }}>
            Sheet without a title header.
          </p>
          <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
            Dismiss
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

export const NoTitle: Story = {
  name: 'Without title',
  render: () => <NoTitleDemo />,
};
