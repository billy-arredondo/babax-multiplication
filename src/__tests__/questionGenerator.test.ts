import { describe, it, expect } from 'vitest';
import { generateQuestions } from '../lib/questionGenerator';

describe('generateQuestions', () => {
  it('returns the exact requested count', () => {
    const qs = generateQuestions([3, 5], 10, 'multiple');
    expect(qs).toHaveLength(10);
  });

  it('only uses the specified tables', () => {
    const tables = [2, 7];
    const qs = generateQuestions(tables, 20, 'keypad');
    for (const q of qs) {
      expect(tables).toContain(q.a);
    }
  });

  it('multipliers are always in range 1–12', () => {
    const qs = generateQuestions([4, 8, 12], 30, 'keypad');
    for (const q of qs) {
      expect(q.b).toBeGreaterThanOrEqual(1);
      expect(q.b).toBeLessThanOrEqual(12);
    }
  });

  it('correct answer equals a * b', () => {
    const qs = generateQuestions([6], 12, 'keypad');
    for (const q of qs) {
      expect(q.correct).toBe(q.a * q.b);
    }
  });

  it('generates options only when answerType is multiple', () => {
    const mqs = generateQuestions([3], 5, 'multiple');
    for (const q of mqs) {
      expect(q.options).toBeDefined();
      expect(q.options).toHaveLength(4);
    }

    const kqs = generateQuestions([3], 5, 'keypad');
    for (const q of kqs) {
      expect(q.options).toBeUndefined();
    }
  });

  it('options always include the correct answer exactly once', () => {
    const qs = generateQuestions([7], 12, 'multiple');
    for (const q of qs) {
      const opts = q.options!;
      expect(opts.filter((o) => o === q.correct)).toHaveLength(1);
    }
  });

  it('handles count > unique combinations (with repetitions)', () => {
    // 1 table × 12 multipliers = 12 unique; requesting 20 forces repetitions
    const qs = generateQuestions([9], 20, 'keypad');
    expect(qs).toHaveLength(20);
    for (const q of qs) {
      expect(q.a).toBe(9);
    }
  });

  it('returns empty array for empty tables', () => {
    expect(generateQuestions([], 10, 'multiple')).toHaveLength(0);
  });

  it('returns empty array for count = 0', () => {
    expect(generateQuestions([3], 0, 'multiple')).toHaveLength(0);
  });

  it('assigns a unique id to each question', () => {
    const qs = generateQuestions([1, 2, 3], 15, 'multiple');
    const ids = new Set(qs.map((q) => q.id));
    expect(ids.size).toBe(15);
  });
});
