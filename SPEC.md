# Kami — Design System Spec

**kami** (紙) = paper. Thin, layered, tactile.

A native-feeling React UI library for Capacitor and mobile web. Built for iOS-first experiences that run in a browser too.

---

## Philosophy

- **Feel native, not simulated.** Every interaction should feel like it belongs on iOS. Spring physics, proper touch targets, swipe gestures, haptic feedback.
- **Paper metaphor.** Sheets layer over sheets. Cards lift off the surface. Everything has physical weight.
- **Tokens over magic numbers.** Never hardcode colors, spacing, or radii. Always use design tokens from `tokens.ts`.
- **Platform-aware.** Components detect whether they're running in Capacitor (native) or the browser (web) and behave accordingly — but always look native.
- **Accessible by default.** Touch targets are minimum 44px (Apple HIG). Focus states are visible. ARIA roles are correct.

---

## Design Tokens

All tokens live in `src/tokens.ts` (JS) and `src/index.css` (CSS custom properties).

| Category | Key file | Notes |
|----------|----------|-------|
| Color | `color`, `surface` | Brand + semantic |
| Typography | `text`, `font` | iOS scale: 11px–34px |
| Spacing | `space` | 4px base grid |
| Radius | `radius` | xs(6)→xl(28)→full |
| Shadow | `shadow` | xs→float (for sheets/tab bar) |
| Motion | `duration`, `ease`, `transition` | fast(150ms)→slow(380ms) |
| Z-index | `z` | base→top(9999) |
| Touch | `touchTarget` | 44px Apple HIG minimum |

**Rule:** If you're writing a pixel value anywhere in a component, you're doing it wrong. Use a token.

---

## Animation

Spring physics primitives in `src/animations.ts`.

- `spring(config)` — compute a spring animation curve
- `animate(keyframes, config)` — run a spring animation
- `pageTransition` — standard page push/pop transition
- `springs` — preset spring configs (gentle, snappy, bouncy)
- `Presets` — named animation presets (fadeIn, slideUp, etc.)

**Rule:** Use spring animations for entrances/exits. Use CSS transitions (from `transition` tokens) for micro-interactions (hover, press states).

---

## Component Inventory

### Navigation + Layout
| Component | Description | Status |
|-----------|-------------|--------|
| `NavigationStack` | Push/pop navigation with swipe-back | ✅ |
| `TabBar` | iOS-style bottom tab bar | ✅ |
| `Page` | Full-screen page container with safe areas | ✅ |
| `Navbar` | Top navigation bar with back button | ✅ |

### Overlays
| Component | Description | Status |
|-----------|-------------|--------|
| `BottomSheet` | Draggable sheet from bottom, spring physics | ✅ |
| `ActionSheet` | iOS action sheet with destructive actions | ✅ |
| `Toast` + `ToastProvider` | Ephemeral notifications, top/bottom position | ✅ |
| `ActivityIndicator` | Circular spinner (inline, button loading, full-screen overlay) | ✅ |

### Core UI
| Component | Description | Status |
|-----------|-------------|--------|
| `Button` | Primary, secondary, ghost, destructive variants | ✅ |
| `Card` | Elevated surface with padding variants | ✅ |
| `Input` | Text input with label, error, helper text | ✅ |
| `SearchBar` | iOS search bar with spring-animated cancel button | ✅ |
| `Switch` | iOS UISwitch toggle with spring thumb + haptics | ✅ |
| `Select` | BottomSheet-based picker — single, multi, searchable | ✅ |
| `PullToRefresh` | iOS overscroll-to-refresh — spring indicator, async callback | ✅ |
| `Avatar` + `AvatarGroup` | Image + initials fallback, online dot, skeleton, pressable | ✅ |
| `EmptyState` | Full-screen / contained zero-content placeholder | ✅ |
| `WheelPicker` | Primitive drum-roll scroll picker column | 📋 Planned |
| `DatePicker` | iOS drum-roll date/time picker (composes WheelPicker) | 📋 Planned |
| `List` + `ListItem` | iOS-style grouped list rows | ✅ |
| `SwipeableListItem` | Swipe-to-reveal trailing/leading row actions | 📋 Planned |
| `Badge` | Numeric or status badge | ✅ |
| `Chip` + `ChipGroup` | Filter chips, selectable | ✅ |
| `SegmentedControl` | iOS segmented picker | ✅ |
| `ProgressBar` | Determinate + indeterminate progress | ✅ |
| `StepDots` | Step indicator for onboarding flows | ✅ |
| `Skeleton` | Loading placeholder shimmer | ✅ |
| `SectionTitle` | Section header with optional action | ✅ |
| `ErrorBoundary` + `ErrorState` | Error handling with retry | ✅ |

### Hooks
| Hook | Description |
|------|-------------|
| `useSwipeBack` | Detects left-edge swipe for back navigation |
| `useNavigation` | Navigate programmatically in a NavigationStack |
| `useScrollToTop` | Scroll to top on tab re-tap (iOS convention) |
| `useToast` | Show toasts from anywhere in the component tree |
| `useHaptics` | Unified haptic feedback: impact / notification / selection |
| `usePan` | Drag delta + velocity via native pointer events |
| `usePinch` | Two-finger scale gesture via native touch events |
| `useLongPress` | 500ms hold with haptic + movement cancellation |

---

## Platform Behavior

### Capacitor (native)
- Haptic feedback via `@capacitor/haptics` — trigger on button press, destructive actions
- Safe area insets respected via CSS env() variables
- Swipe-back gesture wired to NavigationStack

### Web (browser)
- Haptics are no-ops
- Safe areas fall back gracefully
- Mouse events substitute for touch events

---

## File Structure

```
src/
├── index.ts          ← barrel export — all public API
├── index.css         ← design tokens as CSS custom properties
├── tokens.ts         ← design tokens as TypeScript constants
├── animations.ts     ← spring physics primitives
├── types.ts          ← shared prop types
├── hooks/
│   └── useSwipeBack.ts
├── ComponentName.tsx
├── ComponentName.stories.tsx   ← Storybook story (required for each component)
└── ComponentCatalog.tsx        ← in-app dev reference (dev only)
```

---

## Adding a New Component

1. Create `src/ComponentName.tsx` — follow existing patterns (tokens, no magic numbers)
2. Create `src/ComponentName.stories.tsx` — at least a Default story
3. Add types to `src/types.ts` if the component has a props interface
4. Export from `src/index.ts`
5. Add to the Component Inventory table in this SPEC.md

---

## Agent Instructions

When modifying this library:

1. **Read this file first.** Always.
2. **Check tokens.ts before writing any style value.**
3. **Run `npm run typecheck` after changes.**
4. **Update the Component Inventory table if you add/remove components.**
5. **Storybook is the source of truth for visual correctness.** If a component looks wrong in Storybook, it's wrong.
6. **Never break the public API in `index.ts` without bumping the version.**
