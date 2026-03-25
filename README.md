# Technical Test — Range Component

A range slider built with Next.js. Includes two exercises: a normal range with editable values and a fixed-stop range.

## Stack

- **Next.js 16** — App Router, API routes
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4**
- **Vitest** + **React Testing Library** + **MSW** — unit and integration tests
- **Playwright** — E2E tests
- **pnpm** — package manager

## Setup

```bash
pnpm install
pnpm exec playwright install chromium
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values if needed:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Absolute base URL of the deployment. Required only if the range service is called from a Server Component or any Node.js context. Leave empty for local development — the service falls back to the relative path `/api/range` resolved by the browser. |

For a standard local or Vercel deployment this file can be left empty or omitted entirely.

## Commands

```bash
pnpm dev              # dev server at http://localhost:8080
pnpm build            # production build
pnpm start            # production server at http://localhost:8080
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint fix
pnpm test             # Vitest watch mode
pnpm test:run         # Vitest single run
pnpm test:coverage    # Vitest with coverage report
pnpm test:e2e         # Playwright (requires a prior build)
pnpm test:e2e:ui      # Playwright interactive UI mode
pnpm test:e2e:report  # Open last Playwright HTML report
```

## Structure

```
src/
  app/          # pages and API routes (Next.js App Router)
  components/   # Range, RangeThumb, RangeTrack, EditableLabel, ReadOnlyLabel
  hooks/        # useRangeSlider, useFetch, useNormalRange, useFixedRange
  services/     # fetch calls to /api/range/normal and /api/range/fixed
  utils/        # clamp, snapToNearest, formatCurrency
  mocks/        # MSW handlers and test setup
tests/
  unit/         # utils, hooks, components
  integration/  # exercise1 and exercise2 full-page tests
e2e/            # Playwright — home, exercise1, exercise2
```

## How it was built

The project was created **without any scaffolding CLI** (`create-next-app`, `npm init`, etc.). All configuration files were written by hand:

- `package.json` written manually with all required dependencies
- `tsconfig.json`, `next.config.ts`, `postcss.config.js`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs` — all configured from scratch
- Dependencies installed explicitly via `pnpm add`

## Key technical decisions

**`useFetch` — cancel-safe fetch with refetch**
The hook uses a `cancelled` flag to prevent state updates after unmount, and exposes a `refetch` function via an incrementing `fetchKey`. The `fetcher` must have a stable identity (module-level function or wrapped in `useCallback`).

**`rangeService` — URL resolved from environment**
`BASE_URL` is built from `NEXT_PUBLIC_API_URL` when the variable is set, falling back to the relative path `/api/range` otherwise. This makes the service safe to call from a Server Component or any Node.js context (where relative URLs are invalid), while requiring zero configuration for the current Client Component usage.

**`useRangeSlider` — decoupled logic with ref-synced state**
All slider logic (keyboard, pointer, ARIA, clamp, snap) lives in a standalone hook. Components are pure presentation. Refs (`minValueRef`, `maxValueRef`) keep state accessible inside closures to prevent stale reads during rapid interactions. This makes the logic trivial to test in isolation.

**No `useCallback` in `useRangeSlider` — intentional**
The internal functions of the hook (`handleKeyDown`, `handlePointerDown`, `handlePointerMove`, etc.) are not wrapped in `useCallback`. This is a deliberate decision: React's own documentation states that `useCallback` is a performance optimization that should only be applied when there is a measurable rendering problem — not as a preventive measure. In this project, `RangeThumb` and `RangeTrack` are not wrapped in `React.memo`, so stabilising callback references would have zero effect on re-renders. The slider renders a minimal DOM (two thumbs + one track), and even during drag at 60fps there is no perceptible performance bottleneck. Adding `useCallback` without a measurable problem would only introduce a complex dependency graph across tightly coupled internal functions (each one referencing state, refs, and other functions), increasing maintenance cost and cognitive load for no practical gain.

## Accessibility

- Slider thumbs with `role="slider"` and full ARIA attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, `aria-label`)
- Full keyboard navigation: `ArrowRight/Left`, `ArrowUp/Down`, `PageUp/Down`, `Home`, `End`
- Slider group with `role="group"` and `aria-label`
- `EditableLabel` exposes `role="spinbutton"` when editing
- Accessibility tested with `jest-axe` in all integration tests

## Test coverage

| Layer | Tool | Tests |
|-------|------|-------|
| Unit (utils, hooks, components) | Vitest + RTL | 139 |
| Integration (full pages) | Vitest + RTL + MSW | included in the 139 |
| E2E (real browser) | Playwright + Chromium | 43 |

Code coverage from `pnpm test:coverage`:

| Metric | Coverage |
|--------|----------|
| Statements | 98.36% |
| Branches | 94.62% |
| Functions | 100% |
| Lines | 98.75% |

E2E tests specifically cover keyboard-driven slider movement in both exercises, asserting `aria-valuenow` after each key press.
