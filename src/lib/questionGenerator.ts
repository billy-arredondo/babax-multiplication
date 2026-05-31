import { type Question, type AnswerType } from '../types';
import { buildOptions } from './distractors';

let _idCounter = 0;
function makeId(): string {
  return `q_${Date.now()}_${_idCounter++}`;
}

/** In-place Fisher–Yates shuffle – returns the same array */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates `count` questions from the given `tables` (each paired with
 * multipliers 1–12).
 *
 * - If count ≤ unique combinations: no repeats.
 * - If count > unique combinations: cycles through shuffled pools.
 * - Anti-monotony: prevents the same (a,b) pair appearing back-to-back.
 * - Builds option arrays (4-choice) when answerType === 'multiple'.
 */
export function generateQuestions(
  tables: number[],
  count: number,
  answerType: AnswerType,
): Question[] {
  if (tables.length === 0 || count <= 0) return [];

  // Build pool of all unique combinations
  const pool: Omit<Question, 'id' | 'options'>[] = [];
  for (const a of tables) {
    for (let b = 1; b <= 12; b++) {
      pool.push({ a, b, correct: a * b });
    }
  }

  shuffle(pool);

  // Collect `count` entries, cycling with re-shuffle on each pass
  const raw: typeof pool = [];
  while (raw.length < count) {
    const batch = pool.length > 0 ? shuffle([...pool]) : [];
    raw.push(...batch);
  }
  const selected = raw.slice(0, count);

  // Anti-monotony pass: ensure no two consecutive identical (a,b) pairs
  for (let i = 1; i < selected.length; i++) {
    if (selected[i].a === selected[i - 1].a && selected[i].b === selected[i - 1].b) {
      // Find a swap candidate further down (different pair)
      const swapIdx = selected.findIndex(
        (q, idx) => idx > i && (q.a !== selected[i].a || q.b !== selected[i].b),
      );
      if (swapIdx !== -1) {
        [selected[i], selected[swapIdx]] = [selected[swapIdx], selected[i]];
      }
    }
  }

  // Build Question objects
  return selected.map((q) => {
    const question: Question = {
      id: makeId(),
      a: q.a,
      b: q.b,
      correct: q.correct,
    };
    if (answerType === 'multiple') {
      question.options = buildOptions(q.a, q.b, q.correct);
    }
    return question;
  });
}
