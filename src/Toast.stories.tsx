import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from './Toast';
import { Button } from './Button';

const meta: Meta = {
  title: 'UI/Toast',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj;

function ToastDemo() {
  const toast = useToast();

  const variants = [
    { label: 'Default',  msg: 'Changes saved.',              variant: 'default'  },
    { label: 'Success',  msg: 'Bookmark added!',             variant: 'success'  },
    { label: 'Error',    msg: 'Failed to load lesson.',      variant: 'error'    },
    { label: 'Info',     msg: 'Tap any phrase to save it.',  variant: 'info'     },
    { label: 'Warning',  msg: 'Offline mode — limited.',     variant: 'warning'  },
  ] as const;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {variants.map(t => (
        <Button
          key={t.variant}
          variant="secondary"
          onClick={() => toast.show(t.msg, { variant: t.variant })}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  name: 'All variants',
  render: () => <ToastDemo />,
};

function ToastWithAction() {
  const toast = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast.show('Bookmark removed', {
          variant: 'default',
          duration: 4000,
          action: { label: 'Undo', onPress: () => {} },
        })
      }
    >
      With undo action
    </Button>
  );
}

export const WithAction: Story = {
  name: 'With action button',
  render: () => <ToastWithAction />,
};

function ToastTopPosition() {
  const toast = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => toast.show('Top toast!', { position: 'top', variant: 'info' })}
    >
      Top toast
    </Button>
  );
}

export const TopPosition: Story = {
  name: 'Top position',
  render: () => <ToastTopPosition />,
};
