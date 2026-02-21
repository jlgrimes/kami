import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'UI/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    onChange: { action: 'changed' },
  },
};
export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const TwoSegments: Story = {
  name: '2-segment (script toggle)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('hiragana');
    return (
      <div>
        <SegmentedControl
          options={[
            { value: 'hiragana', label: 'Hiragana' },
            { value: 'katakana', label: 'Katakana' },
          ]}
          value={val}
          onChange={setVal}
          aria-label="Script toggle"
        />
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginTop: 8 }}>
          selected: {val}
        </p>
      </div>
    );
  },
};

export const ThreeSegments: Story = {
  name: '3-segment (default)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('all');
    return (
      <div>
        <SegmentedControl
          options={[
            { value: 'all',   label: 'All' },
            { value: 'quiz',  label: 'Quiz' },
            { value: 'saved', label: 'Saved' },
          ]}
          value={val}
          onChange={setVal}
          aria-label="Content filter"
        />
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginTop: 8 }}>
          selected: {val}
        </p>
      </div>
    );
  },
};

export const FourSegments: Story = {
  name: '4-segment (JLPT levels)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('n5');
    return (
      <SegmentedControl
        options={[
          { value: 'n5', label: 'N5' },
          { value: 'n4', label: 'N4' },
          { value: 'n3', label: 'N3' },
          { value: 'n2', label: 'N2' },
        ]}
        value={val}
        onChange={setVal}
        aria-label="JLPT level"
      />
    );
  },
};

export const WithIcons: Story = {
  name: 'With icons',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('list');
    return (
      <SegmentedControl
        options={[
          { value: 'list', label: 'List', icon: '☰' },
          { value: 'grid', label: 'Grid', icon: '⊞' },
          { value: 'map',  label: 'Map',  icon: '🗺' },
        ]}
        value={val}
        onChange={setVal}
        aria-label="View mode"
      />
    );
  },
};

export const SmallSize: Story = {
  name: 'Small size',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('hiragana');
    return (
      <SegmentedControl
        options={[
          { value: 'hiragana', label: 'Hiragana' },
          { value: 'katakana', label: 'Katakana' },
        ]}
        value={val}
        onChange={setVal}
        size="sm"
        aria-label="Script toggle small"
      />
    );
  },
};

export const WithDisabledSegment: Story = {
  name: 'With disabled segment',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('all');
    return (
      <SegmentedControl
        options={[
          { value: 'all',   label: 'All' },
          { value: 'quiz',  label: 'Quiz' },
          { value: 'saved', label: 'Saved', disabled: true },
        ]}
        value={val}
        onChange={setVal}
        aria-label="With disabled"
      />
    );
  },
};
