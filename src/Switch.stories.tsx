import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    variant:  { control: 'radio', options: ['success', 'accent', 'primary'] },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

// ── Controlled wrapper ────────────────────────────────────────────────────────

function Controlled(props: Partial<React.ComponentProps<typeof Switch>>) {
  const [checked, setChecked] = useState(props.checked ?? false);
  return <Switch {...props} checked={checked} onChange={setChecked} />;
}

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default (no label)',
  render: () => <Controlled />,
};

export const DefaultOn: Story = {
  name: 'Default — on',
  render: () => <Controlled checked />,
};

export const WithLabel: Story = {
  name: 'With label',
  render: () => <Controlled label="Enable notifications" />,
};

export const WithSublabel: Story = {
  name: 'With label + sublabel',
  render: () => (
    <Controlled
      label="Push notifications"
      sublabel="Get updates about your lessons"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch checked={false} onChange={() => {}} label="Disabled off" disabled />
      <Switch checked={true}  onChange={() => {}} label="Disabled on"  disabled />
    </div>
  ),
};

export const Variants: Story = {
  name: 'Colour variants',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [vals, setVals] = useState({ success: true, accent: true, primary: true });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(['success', 'accent', 'primary'] as const).map(v => (
          <Controlled
            key={v}
            checked={vals[v]}
            onChange={next => setVals(s => ({ ...s, [v]: next }))}
            label={v}
            variant={v}
          />
        ))}
      </div>
    );
  },
};

/** Realistic settings panel layout */
export const SettingsPanel: Story = {
  name: 'Settings panel (realistic)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [settings, setSettings] = useState({
      notifications: true,
      sound:         true,
      haptics:       true,
      darkMode:      false,
      autoplay:      false,
    });

    const set = (key: keyof typeof settings) => (v: boolean) =>
      setSettings(s => ({ ...s, [key]: v }));

    return (
      <div style={{
        background:   'var(--surface-solid, #fff)',
        borderRadius: 16,
        overflow:     'hidden',
        boxShadow:    'var(--shadow-sm)',
      }}>
        {[
          { key: 'notifications' as const, label: 'Notifications',        sublabel: 'Lesson reminders + tips' },
          { key: 'sound'         as const, label: 'Sound effects' },
          { key: 'haptics'       as const, label: 'Haptic feedback',       sublabel: 'Requires Capacitor native' },
          { key: 'darkMode'      as const, label: 'Dark mode' },
          { key: 'autoplay'      as const, label: 'Autoplay audio',        sublabel: 'Play pronunciation on open' },
        ].map(({ key, label, sublabel }, i, arr) => (
          <div
            key={key}
            style={{
              padding:      '0 16px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--surface-divider, #eee)' : undefined,
            }}
          >
            <Switch
              checked={settings[key]}
              onChange={set(key)}
              label={label}
              sublabel={sublabel}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const KeyboardNav: Story = {
  name: 'Keyboard navigation (tab + Space)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 13, color: 'gray', margin: 0 }}>Tab between switches, press Space to toggle.</p>
      <Controlled label="First option"  />
      <Controlled label="Second option" />
      <Controlled label="Third option"  />
    </div>
  ),
};
