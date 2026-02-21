import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { WheelPicker, DatePicker, useDatePicker } from './WheelPicker';
import { Button } from './Button';

const meta: Meta<typeof WheelPicker> = {
  title: 'UI/WheelPicker',
  component: WheelPicker,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof WheelPicker>;

// ── WheelPicker stories ───────────────────────────────────────────────────────

export const SingleColumn: Story = {
  name: 'WheelPicker — single column',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('N3');
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--surface-solid, white)', borderRadius: 16, overflow: 'hidden', width: 120 }}>
          <WheelPicker
            items={levels}
            value={val}
            onChange={setVal}
            aria-label="JLPT level"
          />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          Selected: <strong>{val}</strong>
        </p>
      </div>
    );
  },
};

export const WithIcons: Story = {
  name: 'WheelPicker — custom labels',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState('30');
    const items = ['5', '10', '15', '20', '25', '30', '45', '60', '90', '120'].map(v => ({
      value: v,
      label: `${v} min`,
    }));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--surface-solid, white)', borderRadius: 16, overflow: 'hidden', width: 100 }}>
          <WheelPicker
            items={items}
            value={val}
            onChange={setVal}
            aria-label="Session duration"
          />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          Session: <strong>{val} min</strong>
        </p>
      </div>
    );
  },
};

// ── DatePicker stories ────────────────────────────────────────────────────────

export const DateMode: Story = {
  name: 'DatePicker — date mode',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [date, setDate] = useState(new Date(2026, 1, 21)); // Feb 21 2026
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <DatePicker mode="date" value={date} onChange={setDate} />
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    );
  },
};

export const TimeMode: Story = {
  name: 'DatePicker — time mode',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [date, setDate] = useState(new Date(2026, 0, 1, 9, 30));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <DatePicker mode="time" value={date} onChange={setDate} />
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    );
  },
};

export const DateTimeMode: Story = {
  name: 'DatePicker — datetime mode',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [date, setDate] = useState(new Date(2026, 1, 21, 14, 0));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <DatePicker mode="datetime" value={date} onChange={setDate} />
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          {date.toLocaleString(undefined, {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>
    );
  },
};

export const InBottomSheet: Story = {
  name: 'useDatePicker — BottomSheet (iOS modal UX)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { value, open, sheet } = useDatePicker({
      mode: 'date',
      initialValue: new Date(2026, 1, 21),
      title: 'Select start date',
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          padding: '16px', background: 'var(--surface-solid, white)',
          borderRadius: 16, boxShadow: 'var(--shadow-sm)',
        }}>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: '0 0 4px' }}>Start date</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
              {value.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <Button variant="ghost" onClick={open}>Change</Button>
          </div>
        </div>
        {sheet}
      </div>
    );
  },
};

export const TimeInBottomSheet: Story = {
  name: 'useDatePicker — time in BottomSheet',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { value, open, sheet } = useDatePicker({
      mode: 'time',
      initialValue: new Date(2026, 0, 1, 9, 0),
      title: 'Daily reminder time',
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          padding: '16px', background: 'var(--surface-solid, white)',
          borderRadius: 16, boxShadow: 'var(--shadow-sm)',
        }}>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: '0 0 4px' }}>Daily reminder</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              {value.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </p>
            <Button variant="ghost" onClick={open}>Edit</Button>
          </div>
        </div>
        {sheet}
      </div>
    );
  },
};
