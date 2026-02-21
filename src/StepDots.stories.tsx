import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepDots } from './Progress';
import { Button } from './Button';

const meta: Meta<typeof StepDots> = {
  title: 'UI/StepDots',
  component: StepDots,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    total:   { control: { type: 'range', min: 2, max: 10 } },
    current: { control: { type: 'range', min: 0, max: 9 } },
    dotSize: { control: { type: 'range', min: 4, max: 16 } },
    gap:     { control: { type: 'range', min: 2, max: 16 } },
  },
};
export default meta;
type Story = StoryObj<typeof StepDots>;

export const Default: Story = {
  args: { total: 5, current: 2 },
};

export const Interactive: Story = {
  name: 'Interactive (advance steps)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [step, setStep] = useState(0);
    const total = 5;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <StepDots total={total} current={step} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))}>← Prev</Button>
          <Button variant="secondary" onClick={() => setStep(s => Math.min(total - 1, s + 1))}>Next →</Button>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          Step {step + 1} / {total}
        </span>
      </div>
    );
  },
};

export const LargeDots: Story = {
  name: 'Large dots (12 px)',
  args: { total: 4, current: 1, dotSize: 12, gap: 8 },
};

export const CompactDots: Story = {
  name: 'Compact (6 px, many steps)',
  args: { total: 8, current: 3, dotSize: 6, gap: 4 },
};

export const TwoSteps: Story = {
  name: 'Two steps (minimum)',
  args: { total: 2, current: 0 },
};

export const LastStep: Story = {
  name: 'Final step',
  args: { total: 5, current: 4 },
};
