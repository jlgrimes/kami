import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionSheet } from './ActionSheet';
import { Button } from './Button';

const meta: Meta<typeof ActionSheet> = {
  title: 'UI/ActionSheet',
  component: ActionSheet,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ActionSheet>;

function ActionSheetDemo() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open action sheet
      </Button>
      {lastAction && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 8 }}>
          Last action: <strong>{lastAction}</strong>
        </p>
      )}

      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title="What would you like to do?"
        actions={[
          {
            label: 'Share phrase',
            onPress: () => { setLastAction('Share phrase'); setOpen(false); },
          },
          {
            label: 'Copy to clipboard',
            onPress: () => { setLastAction('Copy to clipboard'); setOpen(false); },
          },
          {
            label: 'Remove bookmark',
            destructive: true,
            onPress: () => { setLastAction('Remove bookmark'); setOpen(false); },
          },
          {
            label: 'Disabled action',
            disabled: true,
            onPress: () => {},
          },
        ]}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <ActionSheetDemo />,
};

function SimpleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Simple actions
      </Button>
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        actions={[
          { label: 'Edit', onPress: () => setOpen(false) },
          { label: 'Duplicate', onPress: () => setOpen(false) },
          { label: 'Delete', destructive: true, onPress: () => setOpen(false) },
        ]}
      />
    </div>
  );
}

export const NoTitle: Story = {
  name: 'Without title',
  render: () => <SimpleDemo />,
};
