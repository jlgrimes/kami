import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Design Tokens',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

// ── Color swatches ────────────────────────────────────────────────────────────

const BRAND_COLORS = [
  { name: 'ink',      var: '--color-ink' },
  { name: 'paper',    var: '--color-paper' },
  { name: 'accent',   var: '--color-accent' },
  { name: 'noun',     var: '--color-noun' },
  { name: 'topic',    var: '--color-topic' },
  { name: 'subject',  var: '--color-subject' },
  { name: 'object',   var: '--color-object' },
  { name: 'verb',     var: '--color-verb' },
  { name: 'particle', var: '--color-particle' },
];

const STATUS_COLORS = [
  { name: 'success', var: '--color-success' },
  { name: 'warning', var: '--color-warning' },
  { name: 'danger',  var: '--color-danger' },
  { name: 'muted',   var: '--color-muted' },
];

const SURFACE_VARS = [
  '--surface-solid', '--surface-bg', '--input-bg', '--surface-active',
  '--surface-success', '--surface-warning', '--surface-danger', '--surface-info',
];

function Swatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `var(${cssVar})`,
          border: '1px solid var(--surface-divider)',
          boxShadow: 'var(--shadow-xs)',
        }}
      />
      <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--color-muted)', textAlign: 'center' }}>
        {name}
      </span>
    </div>
  );
}

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Brand
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {BRAND_COLORS.map(c => <Swatch key={c.name} name={c.name} cssVar={c.var} />)}
        </div>
      </div>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Semantic
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {STATUS_COLORS.map(c => <Swatch key={c.name} name={c.name} cssVar={c.var} />)}
        </div>
      </div>
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'gray', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Surfaces
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {SURFACE_VARS.map(v => (
            <div
              key={v}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--surface-solid)',
                borderRadius: 12,
                padding: 8,
                border: '1px solid var(--surface-divider)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `var(${v})`,
                  border: '1px solid var(--surface-divider)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-muted)', wordBreak: 'break-all' }}>
                {v.replace('--', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── Typography scale ──────────────────────────────────────────────────────────

const TYPE_SCALE = [
  { label: '3xl / 34px / black',   size: 34, weight: 900,  sample: 'Large Title'  },
  { label: '2xl / 28px / bold',    size: 28, weight: 700,  sample: 'Title 1'      },
  { label: 'xl / 24px / bold',     size: 24, weight: 700,  sample: 'Title 2'      },
  { label: 'lg / 20px / semibold', size: 20, weight: 600,  sample: 'Title 3'      },
  { label: 'md / 17px / semibold', size: 17, weight: 600,  sample: 'Headline'     },
  { label: 'base / 15px / normal', size: 15, weight: 400,  sample: 'Body'         },
  { label: 'sm / 13px / normal',   size: 13, weight: 400,  sample: 'Footnote'     },
  { label: 'xs / 12px / mono',     size: 12, weight: 400,  sample: 'CAPTION MONO', mono: true },
  { label: '2xs / 11px / mono',    size: 11, weight: 400,  sample: 'LABEL',        mono: true },
];

export const Typography: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {TYPE_SCALE.map(t => (
        <div
          key={t.label}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 8,
            padding: '8px 0',
            borderBottom: '1px solid var(--surface-divider)',
          }}
        >
          <span
            style={{
              fontSize: t.size,
              fontWeight: t.weight,
              fontFamily: t.mono ? 'var(--font-mono)' : 'var(--font-sans)',
              color: 'var(--color-ink)',
              lineHeight: 1.2,
            }}
          >
            {t.sample}
          </span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-muted)', flexShrink: 0 }}>
            {t.label}
          </span>
        </div>
      ))}
    </div>
  ),
};

// ── Spacing scale ──────────────────────────────────────────────────────────────

const SPACE_STEPS = [
  { name: '1',  px: 4  },
  { name: '2',  px: 8  },
  { name: '3',  px: 12 },
  { name: '4',  px: 16 },
  { name: '5',  px: 20 },
  { name: '6',  px: 24 },
  { name: '8',  px: 32 },
  { name: '10', px: 40 },
  { name: '12', px: 48 },
];

export const Spacing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {SPACE_STEPS.map(s => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-muted)', width: 24, textAlign: 'right', flexShrink: 0 }}>
            {s.name}
          </span>
          <div
            style={{
              height: 20,
              width: s.px,
              background: 'var(--color-accent)',
              opacity: 0.7,
              borderRadius: 4,
            }}
          />
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-muted)' }}>
            {s.px}px
          </span>
        </div>
      ))}
    </div>
  ),
};

// ── All tokens ─────────────────────────────────────────────────────────────────

export const AllTokens: Story = {
  name: 'All tokens overview',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Colors</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[...BRAND_COLORS, ...STATUS_COLORS].map(c => (
            <Swatch key={c.name} name={c.name} cssVar={c.var} />
          ))}
        </div>
      </div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Typography</h2>
        {TYPE_SCALE.map(t => (
          <div
            key={t.label}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid var(--surface-divider)',
            }}
          >
            <span style={{ fontSize: t.size, fontWeight: t.weight, color: 'var(--color-ink)' }}>
              {t.sample}
            </span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-muted)', flexShrink: 0 }}>
              {t.label}
            </span>
          </div>
        ))}
      </div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Spacing</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SPACE_STEPS.map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'gray', width: 24, textAlign: 'right' }}>{s.name}</span>
              <div style={{ height: 16, width: s.px, background: 'var(--color-accent)', opacity: 0.7, borderRadius: 4 }} />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'gray' }}>{s.px}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
