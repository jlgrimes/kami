import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'UI/SearchBar',
  component: SearchBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    showCancel: { control: 'boolean' },
    disabled:   { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SearchBar>;

// ── Controlled wrapper ────────────────────────────────────────────────────────

function Controlled(props: Partial<React.ComponentProps<typeof SearchBar>>) {
  const [value,      setValue]     = useState(props.value ?? '');
  const [showCancel, setShowCancel] = useState(props.showCancel ?? false);

  return (
    <div style={{ padding: '8px 0' }}>
      <SearchBar
        {...props}
        value={value}
        onChange={setValue}
        showCancel={showCancel}
        onFocus={() => setShowCancel(true)}
        onCancel={() => {
          setValue('');
          setShowCancel(false);
        }}
      />
    </div>
  );
}

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default (tap to focus)',
  render: () => <Controlled placeholder="Search" />,
};

export const WithValue: Story = {
  name: 'With pre-filled value',
  render: () => <Controlled value="Japanese particles" showCancel />,
};

export const CustomPlaceholder: Story = {
  name: 'Custom placeholder',
  render: () => <Controlled placeholder="Search lessons, phrases…" />,
};

export const CustomCancelLabel: Story = {
  name: 'Custom cancel label',
  render: () => <Controlled cancelLabel="Done" placeholder="Search" />,
};

export const Disabled: Story = {
  render: () => (
    <SearchBar
      value=""
      onChange={() => {}}
      placeholder="Search disabled"
      disabled
    />
  ),
};

/** Shows the full lifecycle: focus → type → clear → cancel */
export const FullLifecycle: Story = {
  name: 'Full lifecycle',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value,      setValue]     = useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showCancel, setShowCancel] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [submitted,  setSubmitted]  = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SearchBar
          value={value}
          onChange={setValue}
          showCancel={showCancel}
          onFocus={() => setShowCancel(true)}
          onCancel={() => { setValue(''); setShowCancel(false); setSubmitted(''); }}
          onSubmit={v => setSubmitted(v)}
          placeholder="Search lessons, phrases…"
        />
        {submitted && (
          <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'gray' }}>
            Submitted: &quot;{submitted}&quot;
          </p>
        )}
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#999', lineHeight: 1.6 }}>
          value: &quot;{value}&quot;<br />
          showCancel: {String(showCancel)}
        </div>
      </div>
    );
  },
};

/** Demonstrates the SearchBar embedded in a list header — realistic context */
export const InContext: Story = {
  name: 'In page context',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value,      setValue]     = useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showCancel, setShowCancel] = useState(false);

    const ALL_ITEMS = ['Particles', 'Verb conjugation', 'て-form', 'Conditionals', 'Causative', 'Passive voice'];
    const filtered  = ALL_ITEMS.filter(i =>
      !value || i.toLowerCase().includes(value.toLowerCase())
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 380 }}>
        {/* Page header */}
        <div style={{ padding: '16px 16px 8px', background: 'var(--color-paper)' }}>
          <h2 style={{
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--color-ink)',
            marginBottom: 10,
          }}>
            Lessons
          </h2>
          <SearchBar
            value={value}
            onChange={setValue}
            showCancel={showCancel}
            onFocus={() => setShowCancel(true)}
            onCancel={() => { setValue(''); setShowCancel(false); }}
            placeholder="Search lessons…"
          />
        </div>

        {/* Fake list */}
        <div style={{ padding: '4px 16px' }}>
          {filtered.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', fontSize: 14, padding: '16px 0' }}>
              No results
            </p>
          ) : (
            filtered.map(item => (
              <div
                key={item}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid var(--surface-divider)',
                  fontSize: 15,
                  color: 'var(--color-ink)',
                  fontWeight: 500,
                }}
              >
                {item}
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
};
