# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://localhost:5173
npm test           # run Vitest test suite (once)
npm run test:watch # watch mode
npm run build      # tsc + vite build → dist/
npm run preview    # serve dist/ locally
```

Run a single test file:
```bash
npx vitest run src/__tests__/distractors.test.ts
```

## Stack notes

- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin. There is no `tailwind.config.js`. Custom CSS goes in `src/index.css` under `@import "tailwindcss"`.
- **`vite.config.ts` imports from `vitest/config`**, not `vite`, so the `test:{}` block is type-safe. Do not change this import.
- **Zustand v5 `persist`** — uses `partialize` (not `partializer`). Only `lang` and `config` are persisted; `session` is ephemeral.
- **`base: '/babax-multiplication/'`** is set in `vite.config.ts` for GitHub Pages hosting.

## Architecture

The app is a single-page app with no router. Navigation is driven by a `view` field in the Zustand store (`'admin' | 'player' | 'results' | 'history'`). `App.tsx` renders the matching screen component.

### State (`src/store/gameStore.ts`)

One Zustand store holds everything:
- `config` — admin settings (persisted to LocalStorage as `babax-config`)
- `session` — active game state including timer timestamps (ephemeral)
- `history` — array of past `HistoryEntry` records (persisted via `src/lib/storage.ts`)

The timer uses `performance.now()` timestamps, not accumulated intervals. The pattern is: `elapsedMs` stores frozen elapsed time; `startTimestamp` is the `performance.now()` mark from when the current run segment began. Actual elapsed = `elapsedMs + (performance.now() - startTimestamp)`. On pause, the delta is folded into `elapsedMs` and `startTimestamp` is set to `null`.

### Core logic (`src/lib/`)

- `questionGenerator.ts` — Fisher–Yates shuffle over a pool of all `table × [1..12]` combinations. Cycles with re-shuffle when `count > pool size`. Anti-monotony pass prevents back-to-back identical pairs.
- `distractors.ts` — generates 3 smart distractors via three strategies (adjacent-table products, off-by-factor, near-digit), sorted by closeness to the correct answer. Fallback fills to 3 if edge cases (e.g. `1×1=1`) produce fewer candidates.
- `timer.ts` — `formatTime(ms)` → `mm:ss.d`, `computeTotalTimeMs(difficulty, count)` using `SECONDS_PER_QUESTION` constant from `types.ts`.
- `favicon.ts` — canvas-drawn star favicon updated dynamically. `updateFavicon(competitionMode)` sets the static star (90% canvas, yellow or orange-red). `initFaviconCycle(getCompetitionMode)` starts the 15-second interval that runs a 3-cycle burst animation (50%→90%→50%, full rotation per cycle).

### i18n (`src/i18n/`)

`es.ts` is the source of truth for all translation keys (`TranslationKey` type is derived from it). `en.ts` must mirror every key. `getTranslations(lang)` returns a `t(key)` function. No external i18n library.

### Tests (`src/__tests__/`)

Tests cover pure logic only: `questionGenerator`, `distractors`, and `timer`. No component tests. Vitest globals are enabled (`describe`, `it`, `expect` without imports).
