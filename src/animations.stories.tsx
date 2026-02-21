import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Presets, animate } from './animations';
import { Button } from './Button';
import { List, ListItem } from './List';

const meta: Meta = {
  title: 'UI/Animations',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

function AnimationDemo() {
  const boxRef = useRef<HTMLDivElement>(null);

  const DEMOS = [
    {
      label: 'slideUp',
      run: () => {
        if (!boxRef.current) return;
        boxRef.current.style.opacity = '1';
        boxRef.current.style.transform = 'none';
        animate(boxRef.current, Presets.slideUp.enter);
      },
    },
    {
      label: 'slideDown',
      run: () => {
        if (!boxRef.current) return;
        animate(boxRef.current, Presets.slideDown.enter);
      },
    },
    {
      label: 'scale',
      run: () => {
        if (!boxRef.current) return;
        animate(boxRef.current, Presets.scale.enter);
      },
    },
    {
      label: 'fade',
      run: () => {
        if (!boxRef.current) return;
        animate(boxRef.current, Presets.fade.enter);
      },
    },
    {
      label: 'exit →',
      run: () => {
        if (!boxRef.current) return;
        animate(boxRef.current, Presets.slideUp.exit);
      },
    },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        ref={boxRef}
        style={{
          width: '100%',
          height: 80,
          borderRadius: 16,
          background: 'var(--color-ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: 'white', fontSize: 13, fontFamily: 'monospace' }}>animate me</p>
      </div>

      <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>Presets (tap to fire)</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {DEMOS.map(d => (
          <Button key={d.label} variant="secondary" onClick={d.run}>
            {d.label}
          </Button>
        ))}
      </div>

      <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>Spring configs available</p>
      <List inset>
        {(['default', 'bouncy', 'snappy', 'gentle', 'smooth'] as const).map(name => (
          <ListItem key={name} title={name} subtitle={`springs.${name}`} />
        ))}
      </List>
    </div>
  );
}

export const SpringPresets: Story = {
  name: 'Spring presets (live demo)',
  render: () => <AnimationDemo />,
};
