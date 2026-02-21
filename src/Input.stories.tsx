import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'] },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

// Controlled wrapper for interactive stories
function Controlled(props: Partial<React.ComponentProps<typeof Input>>) {
  const [val, setVal] = useState(props.value ?? '');
  return <Input {...props} value={val} onChange={setVal} />;
}

export const Default: Story = {
  render: () => <Controlled placeholder="Type something…" />,
};

export const WithLabel: Story = {
  render: () => (
    <Controlled
      label="Email"
      helper="We'll never share your email."
      type="email"
      placeholder="you@example.com"
      value="hello@ichikara.app"
    />
  ),
};

export const Clearable: Story = {
  render: () => (
    <Controlled
      label="Search"
      placeholder="Search phrases…"
      leadingIcon="🔍"
      clearable
      value="some text"
    />
  ),
};

export const Error: Story = {
  render: () => (
    <Input
      label="Username"
      error="That username is already taken."
      value="ichikara_user"
      onChange={() => {}}
    />
  ),
};

export const Password: Story = {
  render: () => <Controlled label="Password" type="password" placeholder="••••••••" />,
};

export const Disabled: Story = {
  render: () => (
    <Input label="Read only" value="Cannot edit this" disabled onChange={() => {}} />
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Controlled placeholder="Default input" />
      <Controlled label="With label" placeholder="you@example.com" type="email" value="hello@ichikara.app" />
      <Controlled label="Clearable with icon" leadingIcon="🔍" clearable value="search text" />
      <Input label="Error state" error="Something went wrong." value="bad input" onChange={() => {}} />
      <Controlled label="Password" type="password" />
      <Input label="Disabled" value="Cannot edit" disabled onChange={() => {}} />
    </div>
  ),
};
