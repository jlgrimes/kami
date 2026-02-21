import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, ChipGroup } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'UI/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onToggle: { action: 'toggled' },
  },
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: { label: 'Japanese', selected: false },
};

export const Selected: Story = {
  args: { label: 'Japanese', selected: true },
};

export const WithIcon: Story = {
  args: { label: 'Korean', icon: '🇰🇷', selected: false },
};

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
};

export const ToggleDemo: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [on, setOn] = useState(false);
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Chip label="Japanese" selected={on} onToggle={setOn} />
        <Chip label="Korean" icon="🇰🇷" />
        <Chip label="Disabled" disabled />
      </div>
    );
  },
};

const JLPT = [
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
];

export const SingleSelectGroup: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('N5');
    return (
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, marginBottom: 8, color: 'gray' }}>
          selected: {val}
        </p>
        <ChipGroup options={JLPT} value={val} onChange={v => setVal(v as string)} />
      </div>
    );
  },
};

const CATEGORIES = [
  { value: 'noun', label: 'Noun', icon: '名' },
  { value: 'verb', label: 'Verb', icon: '動' },
  { value: 'adj', label: 'Adj', icon: '形' },
  { value: 'adverb', label: 'Adverb', icon: '副' },
];

export const MultiSelectGroup: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState<string[]>(['noun']);
    return (
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, marginBottom: 8, color: 'gray' }}>
          selected: [{val.join(', ')}]
        </p>
        <ChipGroup
          options={CATEGORIES}
          value={val}
          onChange={v => setVal(v as string[])}
          multi
        />
      </div>
    );
  },
};
