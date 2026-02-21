import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, ListItem } from './List';
import { Badge } from './Badge';

const meta: Meta<typeof List> = {
  title: 'UI/List',
  component: List,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    inset: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: () => (
    <List>
      <ListItem title="Simple item" />
      <ListItem title="With subtitle" subtitle="Supporting text here" />
      <ListItem title="With chevron" chevron onClick={() => {}} />
      <ListItem
        title="With media"
        subtitle="Left slot"
        media={<span style={{ fontSize: 24 }}>🎌</span>}
        chevron
        onClick={() => {}}
      />
      <ListItem
        title="With after text"
        after={<Badge variant="muted" size="sm">7</Badge>}
        chevron
        onClick={() => {}}
      />
    </List>
  ),
};

export const Inset: Story = {
  render: () => (
    <List inset>
      <ListItem title="Inset item 1" chevron onClick={() => {}} />
      <ListItem title="Inset item 2" subtitle="Subtitle" chevron onClick={() => {}} />
      <ListItem title="Inset item 3" chevron onClick={() => {}} />
    </List>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 8 }}>Full-width list</p>
        <List>
          <ListItem title="Simple item" />
          <ListItem title="With subtitle" subtitle="Supporting text here" />
          <ListItem title="With chevron" chevron onClick={() => {}} />
          <ListItem
            title="With media"
            media={<span style={{ fontSize: 24 }}>🎌</span>}
            chevron
            onClick={() => {}}
          />
          <ListItem
            title="With badge after"
            after={<Badge variant="muted" size="sm">7</Badge>}
            chevron
            onClick={() => {}}
          />
        </List>
      </div>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 8 }}>Inset (card-like)</p>
        <List inset>
          <ListItem title="Inset item 1" chevron onClick={() => {}} />
          <ListItem title="Inset item 2" subtitle="Subtitle" chevron onClick={() => {}} />
          <ListItem title="Inset item 3" chevron onClick={() => {}} />
        </List>
      </div>
    </div>
  ),
};
