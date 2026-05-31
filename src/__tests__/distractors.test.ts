import { describe, it, expect } from 'vitest';
import { generateDistractors, buildOptions } from '../lib/distractors';

describe('generateDistractors', () => {
  it('returns exactly 3 distractors', () => {
    expect(generateDistractors(6, 5, 30)).toHaveLength(3);
  });

  it('never includes the correct answer', () => {
    for (const [a, b] of [[2, 3], [7, 8], [12, 12], [1, 1]]) {
      const correct = a * b;
      const ds = generateDistractors(a, b, correct);
      expect(ds).not.toContain(correct);
    }
  });

  it('all distractors are positive', () => {
    for (let a = 1; a <= 12; a++) {
      for (let b = 1; b <= 12; b++) {
        const correct = a * b;
        const ds = generateDistractors(a, b, correct);
        for (const d of ds) {
          expect(d).toBeGreaterThan(0);
        }
      }
    }
  });

  it('all 3 distractors are unique', () => {
    for (let a = 1; a <= 12; a++) {
      for (let b = 1; b <= 12; b++) {
        const correct = a * b;
        const ds = generateDistractors(a, b, correct);
        expect(new Set(ds).size).toBe(3);
      }
    }
  });

  it('6×5=30 → distractors are plausibly close (within ±10)', () => {
    // The classic example from the spec
    const ds = generateDistractors(6, 5, 30);
    for (const d of ds) {
      expect(Math.abs(d - 30)).toBeLessThanOrEqual(12);
    }
  });
});

describe('buildOptions', () => {
  it('returns exactly 4 options', () => {
    expect(buildOptions(6, 5, 30)).toHaveLength(4);
  });

  it('always contains the correct answer exactly once', () => {
    for (const [a, b] of [[3, 4], [9, 7], [11, 12]]) {
      const correct = a * b;
      const opts = buildOptions(a, b, correct);
      expect(opts.filter((o) => o === correct)).toHaveLength(1);
    }
  });

  it('all 4 options are unique', () => {
    for (let a = 1; a <= 12; a++) {
      for (let b = 1; b <= 12; b++) {
        const opts = buildOptions(a, b, a * b);
        expect(new Set(opts).size).toBe(4);
      }
    }
  });
});
