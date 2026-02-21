import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './Progress';
import { Button } from './Button';

// ── ProgressBar stories ───────────────────────────────────────────────────────

const barMeta: Meta<typeof ProgressBar> = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size:    { control: 'radio',  options: ['xs', 'sm', 'md', 'lg'] },
    variant: { control: 'radio',  options: ['accent', 'success', 'warning', 'danger', 'muted'] },
    value:   { control: { type: 'range', min: 0, max: 100 } },
  },
};
export default barMeta;
type BarStory = StoryObj<typeof ProgressBar>;

export const Default: BarStory = {
  args: { value: 60, size: 'sm', variant: 'accent' },
};

export const WithLabel: BarStory = {
  name: 'With label + percentage',
  args: { value: 72, size: 'sm', showLabel: true, label: '72 / 100 lessons complete' },
};

export const RawCountMode: BarStory = {
  name: 'Raw count (value / max)',
  args: { value: 3, max: 7, size: 'sm', showLabel: true },
};

export const AllSizes: BarStory = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', width: 24 }}>{size}</span>
          <div style={{ flex: 1 }}>
            <ProgressBar value={65} size={size} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const AllVariants: BarStory = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['accent', 'success', 'warning', 'danger', 'muted'] as const).map(v => (
        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', width: 48 }}>{v}</span>
          <div style={{ flex: 1 }}>
            <ProgressBar value={65} variant={v} size="sm" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const EdgeCases: BarStory = {
  name: 'Edge cases (0% and 100%)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProgressBar value={0}   size="sm" showLabel label="Not started" />
      <ProgressBar value={100} size="sm" showLabel variant="success" label="All done!" />
    </div>
  ),
};

export const Animated: BarStory = {
  name: 'Animated (click to change value)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState(30);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ProgressBar value={val} size="md" showLabel />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => setVal(v => Math.max(0,   v - 15))}>−15</Button>
          <Button variant="secondary" onClick={() => setVal(v => Math.min(100, v + 15))}>+15</Button>
          <Button variant="ghost"     onClick={() => setVal(0)}>Reset</Button>
        </div>
      </div>
    );
  },
};

// ── StepDots stories ──────────────────────────────────────────────────────────

// Note: Storybook default export already declared above for ProgressBar.
// StepDots gets its own named exports from this same module.
// In a project with multiple default exports, we'd split files — but since
// Storybook v8 supports titled story groups per file via the title field,
// we append a second default by aliasing. For simplicity, StepDots stories
// are exported from a separate file below.
//
// → See Progress.StepDots.stories.tsx
