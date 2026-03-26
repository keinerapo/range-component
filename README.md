# Technical Test — Range Component

A range slider built with Next.js. Includes two exercises: a normal range with editable values and a fixed-stop range.

## Stack

- **Next.js 16** — App Router, API routes
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4**
- **Vitest** + **React Testing Library** + **MSW** — unit and integration tests
- **Playwright** — E2E tests
- **pnpm** — package manager
- **GitHub Actions** — CI pipeline (lint → test → build → E2E → audit)

## Requirements

- Node.js ≥ 22 (see `.nvmrc`)
- pnpm ≥ 10 (declared in `packageManager`)

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
pnpm test:coverage    # Vitest with coverage report (enforces thresholds)
pnpm test:e2e         # Playwright (requires a prior build)
pnpm test:e2e:ui      # Playwright interactive UI mode
pnpm test:e2e:report  # Open last Playwright HTML report
pnpm audit            # pnpm security audit (moderate+)
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

- `package.json` written manually with all required dependencies — includes `engines` field to enforce Node ≥ 22 and pnpm ≥ 10
- `tsconfig.json`, `next.config.ts`, `postcss.config.js`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs` — all configured from scratch
- `.nvmrc` — pins the Node.js version used by local tooling, Vercel, and the CI runner
- `.github/workflows/ci.yml` — CI pipeline written by hand
- Dependencies installed explicitly via `pnpm add`

## CI/CD

The project uses **GitHub Actions** (`.github/workflows/ci.yml`) with five jobs that run on every push and pull request to `main`:

| Job | What it does | Depends on |
|-----|-------------|-----------|
| `lint` | ESLint across `src/` and `tests/` | — |
| `test` | Vitest unit + integration + coverage thresholds | — |
| `build` | `next build` — verifies the production bundle compiles | lint, test |
| `e2e` | Playwright Chromium tests against the production build | build |
| `audit` | `pnpm audit --audit-level=moderate` | — |

`lint` and `test` run in parallel. `build` only starts if both pass. `e2e` reuses the cached `.next/` output from `build` to avoid rebuilding.

Playwright and coverage artefacts are uploaded on every run (including failures) and retained for 7 days, making it possible to inspect reports directly from the GitHub Actions UI without re-running locally.

## Key technical decisions

**`useFetch` — cancel-safe fetch with refetch**
The hook uses a `cancelled` flag to prevent state updates after unmount, and exposes a `refetch` function via an incrementing `fetchKey`. The `fetcher` must have a stable identity (module-level function or wrapped in `useCallback`).

**`rangeService` — URL resolved from environment**
`BASE_URL` is built from `NEXT_PUBLIC_API_URL` when the variable is set, falling back to the relative path `/api/range` otherwise. This makes the service safe to call from a Server Component or any Node.js context (where relative URLs are invalid), while requiring zero configuration for the current Client Component usage.

**`useRangeSlider` — decoupled logic with ref-synced state**
All slider logic (keyboard, pointer, ARIA, clamp, snap) lives in a standalone hook. Components are pure presentation. Refs (`minValueRef`, `maxValueRef`) keep state accessible inside closures to prevent stale reads during rapid interactions. This makes the logic trivial to test in isolation.

**No `useCallback` in `useRangeSlider` — intentional**
The internal functions of the hook (`handleKeyDown`, `handlePointerDown`, `handlePointerMove`, etc.) are not wrapped in `useCallback`. This is a deliberate decision: React's own documentation states that `useCallback` is a performance optimization that should only be applied when there is a measurable rendering problem — not as a preventive measure. In this project, `RangeThumb` and `RangeTrack` are not wrapped in `React.memo`, so stabilising callback references would have zero effect on re-renders. The slider renders a minimal DOM (two thumbs + one track), and even during drag at 60fps there is no perceptible performance bottleneck. Adding `useCallback` without a measurable problem would only introduce a complex dependency graph across tightly coupled internal functions (each one referencing state, refs, and other functions), increasing maintenance cost and cognitive load for no practical gain.

**Coverage thresholds in `vitest.config.ts` — CI enforcement**
`pnpm test:coverage` enforces minimum thresholds (`statements: 99`, `functions: 100`, `lines: 99`, `branches: 95`), making the CI `test` job fail if coverage drops below them. Next.js server-only files (`layout.tsx`, `app/page.tsx`, API routes) and pure type declaration files are explicitly excluded from the coverage scope — they have no executable logic to instrument and are validated by E2E tests instead.

## Accessibility

- Slider thumbs with `role="slider"` and full ARIA attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, `aria-label`)
- Full keyboard navigation: `ArrowRight/Left`, `ArrowUp/Down`, `PageUp/Down`, `Home`, `End`
- Slider group with `role="group"` and `aria-label`
- `EditableLabel` exposes `role="spinbutton"` when editing
- Accessibility tested with `jest-axe` in all integration tests

## Test coverage

| Layer | Tool | Tests |
|-------|------|-------|
| Unit (utils, hooks, components) | Vitest + RTL | 145 |
| Integration (full pages) | Vitest + RTL + MSW | included in the 145 |
| E2E (real browser) | Playwright + Chromium | 43 |

Code coverage from `pnpm test:coverage`:

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 97.89% |
| Functions | 100% |
| Lines | 100% |

> The remaining 2.11% branch gap is a single `if (!cancelled)` guard inside an async `.then()` closure in `useFetch`. The V8 instrumenter cannot track the `cancelled = true` branch when it fires after a Promise resolves post-unmount; the behaviour is verified by a dedicated cancellation test.

E2E tests specifically cover keyboard-driven slider movement in both exercises, asserting `aria-valuenow` after each key press.
