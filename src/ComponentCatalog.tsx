/**
 * ComponentCatalog — in-app developer reference for the Ichikara UI library.
 *
 * Rendered as a full NavigationStack Page. Wire it into Settings behind
 * an `import.meta.env.DEV` guard so it never ships to production.
 *
 * Sections:
 *   01 · Colors        — brand + semantic swatches
 *   02 · Typography    — scale samples
 *   03 · Spacing       — visual ruler
 *   04 · Buttons       — all variants + states
 *   05 · Inputs        — filled, label, error, clearable, password
 *   06 · Badges        — all variants × sizes
 *   07 · Chips         — toggle + ChipGroup (single / multi)
 *   08 · Cards         — default + interactive
 *   09 · Lists         — ListItem variants
 *   10 · Skeletons     — all Skeleton sub-components
 *   11 · Toast         — fire each variant
 *   12 · BottomSheet   — drag-dismiss example
 *   13 · ActionSheet   — destructive + disabled actions
 *   14 · Animations    — spring presets live demo
 *   15 · SegmentedControl — sliding pill tabs (2–6 segments)
 *   16 · Progress        — ProgressBar (linear track) + StepDots (quiz stepper)
 */

import { useState, useRef } from 'react';
import { Page, PageContent } from './Page';
import { Navbar } from './Navbar';
import { SectionTitle } from './SectionTitle';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { Badge } from './Badge';
import { Chip, ChipGroup } from './Chip';
import { List, ListItem } from './List';
import { Skeleton } from './Skeleton';
import { BottomSheet } from './BottomSheet';
import { ActionSheet } from './ActionSheet';
import { useToast } from './Toast';
import { Presets, animate } from './animations';
import { SegmentedControl } from './SegmentedControl';
import { ProgressBar, StepDots } from './Progress';

// ── Helpers ───────────────────────────────────────────────────────────────────

function Row({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-wrap gap-2 ${className}`}>{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <div className="px-4 space-y-3">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-wider mb-1">
      {children}
    </p>
  );
}

// ── 01 · Colors ───────────────────────────────────────────────────────────────

const BRAND_COLORS: Array<{ name: string; var: string }> = [
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

const STATUS_COLORS: Array<{ name: string; var: string }> = [
  { name: 'success', var: '--color-success' },
  { name: 'warning', var: '--color-warning' },
  { name: 'danger',  var: '--color-danger' },
  { name: 'muted',   var: '--color-muted' },
];

function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-12 h-12 rounded-xl border border-[var(--surface-divider)] shadow-sm"
        style={{ background: `var(${cssVar})` }}
      />
      <span className="text-[9px] font-mono text-[var(--color-muted)] text-center leading-tight">
        {name}
      </span>
    </div>
  );
}

function ColorsSection() {
  return (
    <Section title="01 · Colors">
      <Label>Brand</Label>
      <div className="flex flex-wrap gap-3">
        {BRAND_COLORS.map(c => (
          <ColorSwatch key={c.name} name={c.name} cssVar={c.var} />
        ))}
      </div>
      <Label>Semantic</Label>
      <div className="flex flex-wrap gap-3">
        {STATUS_COLORS.map(c => (
          <ColorSwatch key={c.name} name={c.name} cssVar={c.var} />
        ))}
      </div>
      <Label>Surfaces</Label>
      <div className="grid grid-cols-2 gap-2">
        {(['--surface-solid', '--surface-bg', '--input-bg', '--surface-active'] as const).map(v => (
          <div key={v} className="flex items-center gap-2 bg-[var(--surface-solid)] rounded-xl p-2 border border-[var(--surface-divider)]">
            <div
              className="w-8 h-8 rounded-lg border border-[var(--surface-divider)] shrink-0"
              style={{ background: `var(${v})` }}
            />
            <span className="text-[10px] font-mono text-[var(--color-muted)] leading-tight break-all">
              {v.replace('--', '')}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── 02 · Typography ───────────────────────────────────────────────────────────

const TYPE_SCALE: Array<{ label: string; size: string; weight: string; sample: string }> = [
  { label: '3xl / 34px / black',  size: 'text-[34px]', weight: 'font-black',    sample: 'Large Title'   },
  { label: '2xl / 28px / bold',   size: 'text-[28px]', weight: 'font-bold',     sample: 'Title 1'       },
  { label: 'xl / 24px / bold',    size: 'text-[24px]', weight: 'font-bold',     sample: 'Title 2'       },
  { label: 'lg / 20px / semibold',size: 'text-[20px]', weight: 'font-semibold', sample: 'Title 3'       },
  { label: 'md / 17px / semibold',size: 'text-[17px]', weight: 'font-semibold', sample: 'Headline'      },
  { label: 'base / 15px / normal',size: 'text-[15px]', weight: 'font-normal',   sample: 'Body'          },
  { label: 'sm / 13px / normal',  size: 'text-[13px]', weight: 'font-normal',   sample: 'Footnote'      },
  { label: 'xs / 12px / mono',    size: 'text-[12px]', weight: 'font-mono',     sample: 'CAPTION MONO'  },
  { label: '2xs / 11px / mono',   size: 'text-[11px]', weight: 'font-mono',     sample: 'LABEL'         },
];

function TypographySection() {
  return (
    <Section title="02 · Typography">
      <div className="space-y-2">
        {TYPE_SCALE.map(t => (
          <div key={t.label} className="flex items-baseline justify-between gap-2 py-1 border-b border-[var(--surface-divider)] last:border-0">
            <span className={`${t.size} ${t.weight} text-[var(--color-ink)] leading-tight`}>
              {t.sample}
            </span>
            <span className="text-[10px] font-mono text-[var(--color-muted)] shrink-0">{t.label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── 03 · Spacing ──────────────────────────────────────────────────────────────

const SPACE_STEPS = [
  { name: '1', px: 4 },
  { name: '2', px: 8 },
  { name: '3', px: 12 },
  { name: '4', px: 16 },
  { name: '5', px: 20 },
  { name: '6', px: 24 },
  { name: '8', px: 32 },
  { name: '10', px: 40 },
  { name: '12', px: 48 },
];

function SpacingSection() {
  return (
    <Section title="03 · Spacing">
      <div className="space-y-1.5">
        {SPACE_STEPS.map(s => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[var(--color-muted)] w-6 text-right shrink-0">
              {s.name}
            </span>
            <div
              className="h-5 bg-[var(--color-accent)] opacity-70 rounded-sm"
              style={{ width: s.px }}
            />
            <span className="text-[10px] font-mono text-[var(--color-muted)]">{s.px}px</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── 04 · Buttons ──────────────────────────────────────────────────────────────

function ButtonsSection() {
  return (
    <Section title="04 · Buttons">
      <Label>Variants</Label>
      <Row>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </Row>
      <Label>Disabled</Label>
      <Row>
        <Button variant="primary" disabled>Primary</Button>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="ghost" disabled>Ghost</Button>
      </Row>
      <Label>Full width</Label>
      <Button variant="primary" fullWidth>Full width</Button>
      <Button variant="secondary" fullWidth>Full width secondary</Button>
    </Section>
  );
}

// ── 05 · Inputs ───────────────────────────────────────────────────────────────

function InputsSection() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('hello@ichikara.app');
  const [val3, setVal3] = useState('some text');
  const [pwd, setPwd]   = useState('');

  return (
    <Section title="05 · Inputs">
      <Label>Default</Label>
      <Input
        placeholder="Type something…"
        value={val1}
        onChange={setVal1}
      />
      <Label>With label + helper</Label>
      <Input
        label="Email"
        helper="We'll never share your email."
        type="email"
        placeholder="you@example.com"
        value={val2}
        onChange={setVal2}
      />
      <Label>Clearable</Label>
      <Input
        label="Search"
        placeholder="Search phrases…"
        leadingIcon="🔍"
        clearable
        value={val3}
        onChange={setVal3}
      />
      <Label>Error state</Label>
      <Input
        label="Username"
        error="That username is already taken."
        value="ichikara_user"
        onChange={() => {}}
      />
      <Label>Password with toggle</Label>
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={pwd}
        onChange={setPwd}
      />
      <Label>Disabled</Label>
      <Input
        label="Read only"
        value="Cannot edit this"
        disabled
        onChange={() => {}}
      />
    </Section>
  );
}

// ── 06 · Badges ───────────────────────────────────────────────────────────────

function BadgesSection() {
  const variants = ['default', 'primary', 'success', 'warning', 'danger', 'muted'] as const;
  return (
    <Section title="06 · Badges">
      <Label>md size</Label>
      <Row>
        {variants.map(v => (
          <Badge key={v} variant={v}>{v}</Badge>
        ))}
      </Row>
      <Label>sm size</Label>
      <Row>
        {variants.map(v => (
          <Badge key={v} variant={v} size="sm">{v}</Badge>
        ))}
      </Row>
      <Label>With counts</Label>
      <Row>
        <Badge variant="primary">3</Badge>
        <Badge variant="danger">99+</Badge>
        <Badge variant="success">✓</Badge>
        <Badge variant="muted" size="sm">NEW</Badge>
      </Row>
    </Section>
  );
}

// ── 07 · Chips ────────────────────────────────────────────────────────────────

const JLPT_OPTIONS = [
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
] as const;

const CATEGORY_OPTIONS = [
  { value: 'noun',   label: 'Noun',   icon: '名' },
  { value: 'verb',   label: 'Verb',   icon: '動' },
  { value: 'adj',    label: 'Adj',    icon: '形' },
  { value: 'adverb', label: 'Adverb', icon: '副' },
] as const;

function ChipsSection() {
  const [toggle, setToggle] = useState(false);
  const [singleVal, setSingleVal] = useState<string>('N5');
  const [multiVal,  setMultiVal]  = useState<string[]>(['noun']);

  return (
    <Section title="07 · Chips">
      <Label>Individual toggle</Label>
      <Row>
        <Chip label="Japanese" selected={toggle} onToggle={setToggle} />
        <Chip label="Korean" icon="🇰🇷" />
        <Chip label="Disabled" disabled />
      </Row>
      <Label>Single-select group</Label>
      <ChipGroup
        options={JLPT_OPTIONS as unknown as Array<{ value: string; label: string }>}
        value={singleVal}
        onChange={v => setSingleVal(v as string)}
      />
      <Label>Multi-select group</Label>
      <ChipGroup
        options={CATEGORY_OPTIONS as unknown as Array<{ value: string; label: string; icon: string }>}
        value={multiVal}
        onChange={v => setMultiVal(v as string[])}
        multi
      />
    </Section>
  );
}

// ── 08 · Cards ────────────────────────────────────────────────────────────────

function CardsSection() {
  return (
    <Section title="08 · Cards">
      <Label>Default (static)</Label>
      <Card>
        <p className="text-[15px] font-semibold text-[var(--color-ink)]">Card title</p>
        <p className="text-[13px] text-[var(--color-muted)] mt-1">
          Rounded card with border and subtle shadow. No interaction by default.
        </p>
      </Card>
      <Label>Interactive (tap to scale)</Label>
      <Card onClick={() => {}}>
        <p className="text-[15px] font-semibold text-[var(--color-ink)]">Tappable card</p>
        <p className="text-[13px] text-[var(--color-muted)] mt-1">
          Has cursor-pointer, scale-down on press, bg change on active.
        </p>
      </Card>
      <Label>With badge</Label>
      <Card>
        <div className="flex items-start justify-between">
          <p className="text-[15px] font-semibold text-[var(--color-ink)]">Lesson 3</p>
          <Badge variant="success" size="sm">done</Badge>
        </div>
        <p className="text-[13px] text-[var(--color-muted)] mt-1">て-form conjugation</p>
      </Card>
    </Section>
  );
}

// ── 09 · Lists ────────────────────────────────────────────────────────────────

function ListsSection() {
  return (
    <Section title="09 · Lists">
      <Label>Default list (full-width)</Label>
      <List>
        <ListItem title="Simple item" />
        <ListItem title="With subtitle" subtitle="Supporting text here" />
        <ListItem title="With chevron" chevron onClick={() => {}} />
        <ListItem
          title="With media"
          subtitle="Left slot"
          media={<span className="text-2xl">🎌</span>}
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
      <Label>Inset (rounded, card-like)</Label>
      <List inset>
        <ListItem title="Inset item 1" chevron onClick={() => {}} />
        <ListItem title="Inset item 2" subtitle="Subtitle" chevron onClick={() => {}} />
        <ListItem title="Inset item 3" chevron onClick={() => {}} />
      </List>
    </Section>
  );
}

// ── 10 · Skeletons ────────────────────────────────────────────────────────────

function SkeletonsSection() {
  return (
    <Section title="10 · Skeletons">
      <Label>Text lines</Label>
      <Skeleton.Text lines={3} />
      <Label>Circle + line</Label>
      <div className="flex items-center gap-3">
        <Skeleton.Circle size={48} />
        <div className="flex-1 space-y-2">
          <Skeleton.Line height={14} width="70%" />
          <Skeleton.Line height={10} width="50%" />
        </div>
      </div>
      <Label>Generic card</Label>
      <Skeleton.Card />
      <Label>Lesson card</Label>
      <Skeleton.LessonCard />
      <Label>Phrase card</Label>
      <Skeleton.PhraseCard />
      <Label>Lesson grid (4-up)</Label>
      <Skeleton.LessonGrid count={4} />
    </Section>
  );
}

// ── 11 · Toast ────────────────────────────────────────────────────────────────

function ToastSection() {
  const toast = useToast();

  const toasts: Array<{
    label: string;
    msg: string;
    variant: 'default' | 'success' | 'error' | 'info' | 'warning';
  }> = [
    { label: 'Default',  msg: 'Changes saved.',              variant: 'default'  },
    { label: 'Success',  msg: 'Bookmark added!',             variant: 'success'  },
    { label: 'Error',    msg: 'Failed to load lesson.',      variant: 'error'    },
    { label: 'Info',     msg: 'Tap any phrase to save it.',  variant: 'info'     },
    { label: 'Warning',  msg: 'Offline mode — limited.',     variant: 'warning'  },
  ];

  return (
    <Section title="11 · Toast">
      <Label>Fire each variant (auto-dismiss at 2.6 s)</Label>
      <Row>
        {toasts.map(t => (
          <Button
            key={t.variant}
            variant="secondary"
            onClick={() => toast.show(t.msg, { variant: t.variant })}
          >
            {t.label}
          </Button>
        ))}
      </Row>
      <Label>With action button</Label>
      <Button
        variant="secondary"
        onClick={() =>
          toast.show('Bookmark removed', {
            variant: 'default',
            duration: 4000,
            action: { label: 'Undo', onPress: () => {} },
          })
        }
      >
        With undo action
      </Button>
      <Label>Top position</Label>
      <Button
        variant="secondary"
        onClick={() => toast.show('Top toast!', { position: 'top', variant: 'info' })}
      >
        Top toast
      </Button>
    </Section>
  );
}

// ── 12 · BottomSheet ──────────────────────────────────────────────────────────

function BottomSheetSection() {
  const [open, setOpen] = useState(false);

  return (
    <Section title="12 · BottomSheet">
      <Label>Spring-physics modal sheet, drag to dismiss</Label>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open bottom sheet
      </Button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Example sheet">
        <div className="space-y-4 py-4">
          <p className="text-[15px] text-[var(--color-ink)]">
            Drag the handle down or tap the backdrop to dismiss.
          </p>
          <p className="text-[13px] text-[var(--color-muted)]">
            Spring entry animation via Web Animations API.
            No ResizeObserver. Works in Capacitor WKWebView.
          </p>
          <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
            Confirm
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </Section>
  );
}

// ── 13 · ActionSheet ──────────────────────────────────────────────────────────

function ActionSheetSection() {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  return (
    <Section title="13 · ActionSheet">
      <Label>iOS-style contextual action list</Label>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open action sheet
      </Button>

      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title="What would you like to do?"
        actions={[
          {
            label: 'Share phrase',
            onPress: () => toast.show('Shared!', { variant: 'success' }),
          },
          {
            label: 'Copy to clipboard',
            onPress: () => toast.show('Copied!', { variant: 'default' }),
          },
          {
            label: 'Remove bookmark',
            destructive: true,
            onPress: () => toast.show('Removed', { variant: 'error' }),
          },
          {
            label: 'Disabled action',
            disabled: true,
            onPress: () => {},
          },
        ]}
      />
    </Section>
  );
}

// ── 14 · Animations ──────────────────────────────────────────────────────────

function AnimationsSection() {
  const boxRef = useRef<HTMLDivElement>(null);

  const DEMOS: Array<{
    label: string;
    run: () => void;
  }> = [
    {
      label: 'slideUp',
      run: () => {
        if (!boxRef.current) return;
        boxRef.current.style.opacity = '1';
        boxRef.current.style.transform = 'none';
        animate(boxRef.current, Presets.slideUp.enter);
      },
    },
    {
      label: 'slideDown',
      run: () => {
        if (!boxRef.current) return;
        animate(boxRef.current, Presets.slideDown.enter);
      },
    },
    {
      label: 'scale',
      run: () => {
        if (!boxRef.current) return;
        animate(boxRef.current, Presets.scale.enter);
      },
    },
    {
      label: 'fade',
      run: () => {
        if (!boxRef.current) return;
        animate(boxRef.current, Presets.fade.enter);
      },
    },
    {
      label: 'exit →',
      run: () => {
        if (!boxRef.current) return;
        animate(boxRef.current, Presets.slideUp.exit);
      },
    },
  ];

  return (
    <Section title="14 · Animations">
      <Label>Target element</Label>
      <div
        ref={boxRef}
        className="w-full h-20 rounded-2xl bg-[var(--color-ink)] flex items-center justify-center select-none"
      >
        <p className="text-white text-sm font-mono">animate me</p>
      </div>
      <Label>Presets (tap to fire)</Label>
      <Row>
        {DEMOS.map(d => (
          <Button key={d.label} variant="secondary" onClick={d.run}>
            {d.label}
          </Button>
        ))}
      </Row>
      <Label>Spring configs available</Label>
      <List inset>
        {(['default', 'bouncy', 'snappy', 'gentle', 'smooth'] as const).map(name => (
          <ListItem key={name} title={name} subtitle={`springs.${name}`} />
        ))}
      </List>
    </Section>
  );
}

// ── 15 · SegmentedControl ─────────────────────────────────────────────────────

function SegmentedControlSection() {
  const [tab2,   setTab2]   = useState<'hiragana' | 'katakana'>('hiragana');
  const [tab3,   setTab3]   = useState<'all' | 'quiz' | 'saved'>('all');
  const [tab4,   setTab4]   = useState<'n5' | 'n4' | 'n3' | 'n2'>('n5');
  const [tabIco, setTabIco] = useState<'list' | 'grid' | 'map'>('list');

  return (
    <Section title="15 · SegmentedControl">
      <Label>2-segment (script toggle)</Label>
      <SegmentedControl
        options={[
          { value: 'hiragana', label: 'Hiragana' },
          { value: 'katakana', label: 'Katakana' },
        ]}
        value={tab2}
        onChange={setTab2}
        aria-label="Script toggle"
      />

      <Label>3-segment (default)</Label>
      <SegmentedControl
        options={[
          { value: 'all',   label: 'All' },
          { value: 'quiz',  label: 'Quiz' },
          { value: 'saved', label: 'Saved' },
        ]}
        value={tab3}
        onChange={setTab3}
        aria-label="Content filter"
      />

      <Label>4-segment (JLPT levels)</Label>
      <SegmentedControl
        options={[
          { value: 'n5', label: 'N5' },
          { value: 'n4', label: 'N4' },
          { value: 'n3', label: 'N3' },
          { value: 'n2', label: 'N2' },
        ]}
        value={tab4}
        onChange={setTab4}
        aria-label="JLPT level"
      />

      <Label>With icons</Label>
      <SegmentedControl
        options={[
          { value: 'list', label: 'List',  icon: '☰' },
          { value: 'grid', label: 'Grid',  icon: '⊞' },
          { value: 'map',  label: 'Map',   icon: '🗺' },
        ]}
        value={tabIco}
        onChange={setTabIco}
        aria-label="View mode"
      />

      <Label>Small size</Label>
      <SegmentedControl
        options={[
          { value: 'hiragana', label: 'Hiragana' },
          { value: 'katakana', label: 'Katakana' },
        ]}
        value={tab2}
        onChange={setTab2}
        size="sm"
        aria-label="Script toggle small"
      />

      <Label>With disabled segment</Label>
      <SegmentedControl
        options={[
          { value: 'all',   label: 'All' },
          { value: 'quiz',  label: 'Quiz' },
          { value: 'saved', label: 'Saved', disabled: true },
        ]}
        value={tab3}
        onChange={setTab3 as (v: string) => void}
        aria-label="With disabled"
      />

      <Label>Selected: <span className="font-mono text-[var(--color-accent)]">{tab3}</span></Label>
    </Section>
  );
}

// ── 16 · Progress ─────────────────────────────────────────────────────────────

function ProgressSection() {
  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 5;

  return (
    <Section title="16 · Progress">

      {/* ── ProgressBar ── */}
      <Label>xs (3 px) — minimal, understated</Label>
      <ProgressBar value={40} size="xs" />

      <Label>sm (6 px) — default, like Home.tsx course bar</Label>
      <ProgressBar value={72} size="sm" showLabel label="72 / 100 lessons complete" />

      <Label>md (8 px) — emphasis</Label>
      <ProgressBar value={55} size="md" showLabel />

      <Label>lg (12 px) — shimmer fill</Label>
      <ProgressBar value={88} size="lg" showLabel />

      <Label>Variants</Label>
      <div className="space-y-2">
        {(['accent', 'success', 'warning', 'danger', 'muted'] as const).map(v => (
          <div key={v} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[var(--color-muted)] w-14 shrink-0">{v}</span>
            <div className="flex-1">
              <ProgressBar value={65} variant={v} size="sm" />
            </div>
          </div>
        ))}
      </div>

      <Label>0% and 100% edge cases</Label>
      <ProgressBar value={0}   size="sm" showLabel label="Not started" />
      <ProgressBar value={100} size="sm" showLabel variant="success" label="Complete!" />

      <Label>Raw count mode (value / max)</Label>
      <ProgressBar value={3} max={7} size="sm" showLabel />

      {/* ── StepDots ── */}
      <Label>StepDots — default (5 steps, tap to advance)</Label>
      <StepDots total={TOTAL_STEPS} current={step} />
      <div className="flex gap-2 justify-center">
        <Button
          variant="secondary"
          onClick={() => setStep(s => Math.max(0, s - 1))}
        >
          ← Prev
        </Button>
        <Button
          variant="secondary"
          onClick={() => setStep(s => Math.min(TOTAL_STEPS - 1, s + 1))}
        >
          Next →
        </Button>
      </div>
      <p className="text-center text-[11px] font-mono text-[var(--color-muted)]">
        Step {step + 1} / {TOTAL_STEPS}
      </p>

      <Label>StepDots — larger dots (12 px)</Label>
      <StepDots total={4} current={1} dotSize={12} gap={8} />

      <Label>StepDots — compact (6 px, tight gap)</Label>
      <StepDots total={8} current={4} dotSize={6} gap={4} />
    </Section>
  );
}

// ── Main catalog page ─────────────────────────────────────────────────────────

export function ComponentCatalog() {
  return (
    <Page>
      <Navbar title="UI Catalog" />
      <PageContent>
        <div className="space-y-8 py-4 pb-16">
          {/* Dev banner */}
          <div className="mx-4 px-4 py-3 rounded-2xl bg-[var(--surface-warning)] border border-[var(--surface-divider)]">
            <p className="text-[12px] font-mono text-[#7a5c00] leading-snug">
              ⚙ Development only — not visible in production builds.
            </p>
          </div>

          <ColorsSection />
          <TypographySection />
          <SpacingSection />
          <ButtonsSection />
          <InputsSection />
          <BadgesSection />
          <ChipsSection />
          <CardsSection />
          <ListsSection />
          <SkeletonsSection />
          <ToastSection />
          <BottomSheetSection />
          <ActionSheetSection />
          <AnimationsSection />
          <SegmentedControlSection />
          <ProgressSection />
        </div>
      </PageContent>
    </Page>
  );
}
