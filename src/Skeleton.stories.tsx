import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta = {
  title: 'UI/Skeleton',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const TextLines: Story = {
  name: 'Text lines',
  render: () => <Skeleton.Text lines={3} />,
};

export const CircleAndLine: Story = {
  name: 'Circle + line',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skeleton.Circle size={48} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton.Line height={14} width="70%" />
        <Skeleton.Line height={10} width="50%" />
      </div>
    </div>
  ),
};

export const GenericCard: Story = {
  name: 'Generic card',
  render: () => <Skeleton.Card />,
};

export const LessonCard: Story = {
  name: 'Lesson card',
  render: () => <Skeleton.LessonCard />,
};

export const PhraseCard: Story = {
  name: 'Phrase card',
  render: () => <Skeleton.PhraseCard />,
};

export const LessonGrid: Story = {
  name: 'Lesson grid (4-up)',
  render: () => <Skeleton.LessonGrid count={4} />,
};

export const AllSkeletons: Story = {
  name: 'All skeletons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 8 }}>Text lines</p>
        <Skeleton.Text lines={3} />
      </div>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 8 }}>Circle + line</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton.Circle size={48} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton.Line height={14} width="70%" />
            <Skeleton.Line height={10} width="50%" />
          </div>
        </div>
      </div>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 8 }}>Generic card</p>
        <Skeleton.Card />
      </div>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 8 }}>Lesson card</p>
        <Skeleton.LessonCard />
      </div>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 8 }}>Phrase card</p>
        <Skeleton.PhraseCard />
      </div>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 8 }}>Lesson grid (4-up)</p>
        <Skeleton.LessonGrid count={4} />
      </div>
    </div>
  ),
};
