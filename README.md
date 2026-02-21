# Kami

> Native-feeling React UI library for Capacitor and mobile web.

**iOS-native feel. Zero compromise.** Spring physics, 44px touch targets, haptic feedback, Capacitor-aware — all powered by design tokens.

[![npm](https://img.shields.io/npm/v/@jlgrimes/kami)](https://www.npmjs.com/package/@jlgrimes/kami)
[![CI](https://github.com/jlgrimes/kami/actions/workflows/ci.yml/badge.svg)](https://github.com/jlgrimes/kami/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785)](https://kami-phi.vercel.app)

---

## Install

### Local Development (Workspace)

Since this package is developed alongside `ichikara` in the same workspace:

```bash
# In your app directory (e.g. ichikara/)
npm install ../kami
```

### From npm (Published)

*Once published:*

```bash
npm install @jlgrimes/kami
# or
yarn add @jlgrimes/kami
```

**Peer dependencies:** React ≥ 18

---

## Quickstart

### 1. Import the stylesheet

```tsx
// In your app root (e.g. main.tsx)
import '@jlgrimes/kami/dist/style.css'; // ← design tokens + base styles
```

### 2. Use components

```tsx
import {
  Button,
  Input,
  BottomSheet,
  SearchBar,
  Switch,
  Select,
  Avatar,
  EmptyState,
} from '@jlgrimes/kami';

function App() {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const [lang,  setLang]  = useState<string | null>(null);
  const [on,    setOn]    = useState(false);

  return (
    <>
      {/* Buttons */}
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost">Learn more</Button>

      {/* Search bar */}
      <SearchBar
        value={query}
        onChange={setQuery}
        showCancel={query.length > 0}
        onCancel={() => setQuery('')}
        placeholder="Search lessons…"
      />

      {/* iOS switch */}
      <Switch
        checked={on}
        onChange={setOn}
        label="Enable notifications"
        sublabel="Get lesson reminders"
      />

      {/* BottomSheet-based picker */}
      <Select
        options={[
          { value: 'ja', label: 'Japanese', icon: '🇯🇵' },
          { value: 'ko', label: 'Korean',   icon: '🇰🇷' },
        ]}
        value={lang}
        onChange={setLang}
        label="Language"
        searchable
        clearable
        onClear={() => setLang(null)}
      />

      {/* BottomSheet */}
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Hello">
        <p>Sheet content goes here.</p>
      </BottomSheet>
    </>
  );
}
```

---

## Component Gallery

**Live Storybook:** [kami-phi.vercel.app](https://kami-phi.vercel.app)

---

## Component Reference

### Core UI

| Component | Description |
|-----------|-------------|
| `Button` | iOS-style tap button — primary, secondary, ghost variants |
| `Input` | Text input with label, error, helper, clear, password-reveal |
| `SearchBar` | iOS search bar with spring-animated Cancel button |
| `Switch` | iOS UISwitch toggle — spring physics, haptics, 3 colour variants |
| `Select` | BottomSheet-based picker — single, multi, searchable |
| `SegmentedControl` | Sliding-pill segment tabs (2–6 segments) |
| `Badge` | Status badge — accent, success, warning, danger, info |
| `Chip` + `ChipGroup` | Pill chips for tags/filters |
| `Avatar` + `AvatarGroup` | Image + initials fallback, online dot, skeleton |
| `EmptyState` | Full-screen / contained zero-content placeholder |

### Feedback & Overlays

| Component | Description |
|-----------|-------------|
| `BottomSheet` | iOS-style modal sheet with spring enter/exit + drag-to-dismiss |
| `ActionSheet` | Contextual action list (iOS UIActionSheet) |
| `Toast` | Non-blocking ephemeral message — success/error/info/warning |
| `Skeleton` | Shimmer loading placeholders |
| `ErrorBoundary` | React error boundary with retry support |

### Navigation

| Component | Description |
|-----------|-------------|
| `NavigationStack` | Push/pop navigation with iOS slide + swipe-back |
| `TabBar` | Floating pill tab bar |
| `Navbar` | Navigation header with back button + scroll-to-top |
| `Page` | Scrollable page container |

### Interaction

| Component | Description |
|-----------|-------------|
| `PullToRefresh` | Overscroll-to-refresh with SVG arc indicator |
| `List` + `ListItem` | iOS-style grouped list |
| `SectionTitle` | Section header label |

### Hooks

| Hook | Description |
|------|-------------|
| `useHaptics()` | Unified haptic feedback: impact / notification / selection |
| `usePan(options)` | Drag delta + velocity via native pointer events |
| `usePinch(options)` | Two-finger scale gesture |
| `useLongPress(options)` | 500ms hold with haptic + movement cancellation |
| `useFocusTrap(ref, active, onEscape)` | Keyboard focus trap for modals |
| `useNavigation()` | push/pop within a NavigationStack |
| `useSwipeBack()` | Programmatic swipe-back trigger |

---

## Design Tokens

Kami uses CSS custom properties for all colours, radii, shadows, and typography. Override any token in your own stylesheet:

```css
:root {
  --color-accent:   #e63946;   /* primary interactive colour */
  --color-ink:      #1a1a2e;   /* primary text */
  --color-paper:    #f8f4ef;   /* page background */
  --color-muted:    #8a8a9a;   /* secondary text */
  --color-success:  #2d6a4f;
  --color-warning:  #e9c46a;
  --color-danger:   #e63946;
  --radius-sm:      10px;
  --radius-full:    9999px;
  --font-sans:      'Inter', system-ui, sans-serif;
  --font-mono:      'JetBrains Mono', monospace;
}
```

Dark mode is handled automatically via `@media (prefers-color-scheme: dark)`.

---

## Publish a New Version

```bash
# 1. Bump version in package.json
npm version patch   # or minor / major

# 2. Push the tag — GitHub Actions publishes automatically
git push --follow-tags
```

Requires `NPM_TOKEN` secret set in GitHub repository settings (Settings → Secrets → Actions).

---

## License

MIT © Jared Grimes
