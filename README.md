# Babax — Multiplication Tables

A bilingual (ES/EN) practice and quiz app for multiplication tables 1–12, built for kids. Runs entirely in the browser — no backend, no account required.

**Live:** https://billy-arredondo.github.io/babax-multiplication/

## Features

- **Admin mode** — choose which tables to practice (1–12), number of questions (presets or custom), answer type (4-choice or numeric keypad), and an optional countdown timer with Easy / Medium / Hard difficulty.
- **Player mode** — Start, Pause, Resume, and Stop controls; `mm:ss.d` timer display; progress bar; immediate correct/incorrect feedback with animations.
- **Results** — accuracy %, time used, and a full breakdown of every missed question (your answer vs. correct answer). Confetti on ≥ 80%.
- **History** — last 50 sessions persisted in LocalStorage.
- **Smart distractors** — wrong options in 4-choice mode are generated from adjacent-table products and near-digit errors, not random numbers.
- **Animated favicon** — star icon pulses and rotates every 15 s; yellow by default, orange-red during a quiz.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS v4 · Zustand v5 · Vitest

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # run test suite
npm run build     # production build → dist/
```

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via `.github/workflows/deploy.yml`. Tests must pass for the deploy to proceed.
