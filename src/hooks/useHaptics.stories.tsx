/**
 * useHaptics stories — demonstrates the hook via a demo panel.
 * On mobile / Capacitor: actually fires haptics.
 * On desktop/web: fires silently (no-op).
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useHaptics } from './useHaptics';
import { Button } from '../Button';

// Storybook requires a component as the default export — we use a demo component.
function HapticsDemo() {
  const haptics = useHaptics();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Impact */}
      <div>
        <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'gray', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          impact()
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => haptics.impact('light')}>
            light
          </Button>
          <Button variant="secondary" onClick={() => haptics.impact('medium')}>
            medium
          </Button>
          <Button variant="secondary" onClick={() => haptics.impact('heavy')}>
            heavy
          </Button>
        </div>
      </div>

      {/* Notification */}
      <div>
        <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'gray', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          notification()
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => haptics.notification('success')}>
            success
          </Button>
          <Button variant="secondary" onClick={() => haptics.notification('warning')}>
            warning
          </Button>
          <Button variant="secondary" onClick={() => haptics.notification('error')}>
            error
          </Button>
        </div>
      </div>

      {/* Selection */}
      <div>
        <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'gray', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          selection()
        </p>
        <Button variant="secondary" onClick={() => haptics.selection()}>
          selection tick
        </Button>
      </div>

      <p style={{ fontSize: 12, color: '#aaa', lineHeight: 1.5, margin: 0 }}>
        On device (Capacitor): each button fires real haptic feedback.<br />
        On desktop/web: silent no-op — no errors thrown.
      </p>
    </div>
  );
}

const meta: Meta<typeof HapticsDemo> = {
  title: 'Hooks/useHaptics',
  component: HapticsDemo,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof HapticsDemo>;

export const Demo: Story = {
  name: 'Haptics API demo',
  render: () => <HapticsDemo />,
};
