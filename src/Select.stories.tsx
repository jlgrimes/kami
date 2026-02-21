import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    searchable: { control: 'boolean' },
    disabled:   { control: 'boolean' },
    clearable:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

// ── Sample data ───────────────────────────────────────────────────────────────

const LANGUAGES = [
  { value: 'ja', label: 'Japanese',  icon: '🇯🇵', sublabel: '日本語' },
  { value: 'ko', label: 'Korean',    icon: '🇰🇷', sublabel: '한국어' },
  { value: 'zh', label: 'Chinese',   icon: '🇨🇳', sublabel: '普通话' },
  { value: 'es', label: 'Spanish',   icon: '🇪🇸', sublabel: 'Español' },
  { value: 'fr', label: 'French',    icon: '🇫🇷', sublabel: 'Français' },
  { value: 'de', label: 'German',    icon: '🇩🇪', sublabel: 'Deutsch' },
  { value: 'pt', label: 'Portuguese',icon: '🇧🇷', sublabel: 'Português' },
  { value: 'it', label: 'Italian',   icon: '🇮🇹', sublabel: 'Italiano' },
  { value: 'ar', label: 'Arabic',    icon: '🇸🇦', sublabel: 'العربية' },
  { value: 'ru', label: 'Russian',   icon: '🇷🇺', sublabel: 'Русский' },
];

const LEVELS = [
  { value: 'n5', label: 'N5 — Absolute beginner',   sublabel: 'Basic greetings and numbers' },
  { value: 'n4', label: 'N4 — Elementary',           sublabel: 'Simple everyday conversation' },
  { value: 'n3', label: 'N3 — Intermediate',         sublabel: 'Understand general topics' },
  { value: 'n2', label: 'N2 — Upper intermediate',   sublabel: 'Near-native reading ability' },
  { value: 'n1', label: 'N1 — Advanced / native',    sublabel: 'Full professional proficiency' },
];

const CATEGORIES = [
  { value: 'grammar',    label: 'Grammar',     icon: '📖' },
  { value: 'vocab',      label: 'Vocabulary',  icon: '📝' },
  { value: 'particles',  label: 'Particles',   icon: '⚡' },
  { value: 'verbs',      label: 'Verbs',       icon: '🔄' },
  { value: 'reading',    label: 'Reading',     icon: '🗞' },
  { value: 'listening',  label: 'Listening',   icon: '🎧' },
];

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Single select (basic)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Select
          options={LEVELS}
          value={val}
          onChange={setVal}
          label="JLPT level"
          placeholder="Select your level…"
        />
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          value: {val ?? 'null'}
        </p>
      </div>
    );
  },
};

export const WithIcons: Story = {
  name: 'With icons + sublabels',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState<string | null>('ja');
    return (
      <Select
        options={LANGUAGES}
        value={val}
        onChange={setVal}
        label="Target language"
        placeholder="Choose a language…"
        clearable
        onClear={() => setVal(null)}
      />
    );
  },
};

export const Searchable: Story = {
  name: 'Searchable (10+ options)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState<string | null>(null);
    return (
      <Select
        options={LANGUAGES}
        value={val}
        onChange={setVal}
        label="Language"
        placeholder="Search and select…"
        searchable
      />
    );
  },
};

export const MultiSelect: Story = {
  name: 'Multi-select',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [vals, setVals] = useState<string[]>(['grammar', 'verbs']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Select
          options={CATEGORIES}
          value={vals}
          onChange={setVals}
          label="Study categories"
          placeholder="Select categories…"
          multi
        />
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray' }}>
          selected: [{vals.join(', ')}]
        </p>
      </div>
    );
  },
};

export const MultiSearchable: Story = {
  name: 'Multi-select + searchable',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [vals, setVals] = useState<string[]>([]);
    return (
      <Select
        options={LANGUAGES}
        value={vals}
        onChange={setVals}
        label="Languages to study"
        placeholder="Select languages…"
        multi
        searchable
      />
    );
  },
};

export const Clearable: Story = {
  name: 'Clearable',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = useState<string | null>('n3');
    return (
      <Select
        options={LEVELS}
        value={val}
        onChange={setVal}
        label="Level"
        placeholder="Pick a level…"
        clearable
        onClear={() => setVal(null)}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Select
      options={LEVELS}
      value="n2"
      onChange={() => {}}
      label="Level (locked)"
      disabled
    />
  ),
};

/** Realistic form context — shows how Select composes with other fields */
export const InForm: Story = {
  name: 'In a form',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [lang,  setLang]  = useState<string | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [level, setLevel] = useState<string | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cats,  setCats]  = useState<string[]>([]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>
          Study preferences
        </h2>

        <Select
          options={LANGUAGES}
          value={lang}
          onChange={setLang}
          label="Target language"
          placeholder="Choose a language…"
          searchable
          clearable
          onClear={() => setLang(null)}
        />

        <Select
          options={LEVELS}
          value={level}
          onChange={setLevel}
          label="Starting level"
          placeholder="Select your level…"
          disabled={!lang}
          title="JLPT level"
        />

        <Select
          options={CATEGORIES}
          value={cats}
          onChange={setCats}
          label="Focus areas"
          placeholder="Select topics…"
          multi
          doneLabel="Confirm"
        />

        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#aaa', lineHeight: 1.8 }}>
          lang: {lang ?? '—'}<br/>
          level: {level ?? '—'}<br/>
          cats: [{cats.join(', ')}]
        </div>
      </div>
    );
  },
};
