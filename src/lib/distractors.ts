/**
 * Generates 3 "smart" distractor options for a multiplication question.
 *
 * Strategy priorities (in order):
 *   1. Adjacent-table products: a*(b±1), (a±1)*b
 *   2. Off-by-factor: correct ± a, correct ± b
 *   3. Near-digit: correct ± 1, correct ± 10
 *   4. Fallback: correct + n for increasing n until we have 3
 *
 * Guarantees: exactly 3 unique positive integers, none equal to `correct`.
 */
export function generateDistractors(a: number, b: number, correct: number): number[] {
  const raw = new Set<number>();

  // Strategy 1 – adjacent table products (most pedagogically relevant)
  if (b > 1) raw.add(a * (b - 1));
  raw.add(a * (b + 1));
  if (a > 1) raw.add((a - 1) * b);
  raw.add((a + 1) * b);

  // Strategy 2 – off-by-one-factor
  raw.add(correct + a);
  if (correct - a > 0) raw.add(correct - a);
  raw.add(correct + b);
  if (correct - b > 0) raw.add(correct - b);

  // Strategy 3 – near-digit errors
  raw.add(correct + 1);
  if (correct - 1 > 0) raw.add(correct - 1);
  raw.add(correct + 10);
  if (correct - 10 > 0) raw.add(correct - 10);

  // Remove the correct answer and non-positive values
  const candidates = Array.from(raw).filter((c) => c > 0 && c !== correct);

  // Strategy 4 – fallback: fill up with correct ± increments if needed
  const used = new Set<number>(candidates);
  used.add(correct);
  let offset = 1;
  while (candidates.length < 3) {
    const pos = correct + offset;
    const neg = correct - offset;
    if (pos > 0 && !used.has(pos)) { candidates.push(pos); used.add(pos); }
    if (candidates.length < 3 && neg > 0 && !used.has(neg)) { candidates.push(neg); used.add(neg); }
    offset++;
    // Safety: break after 100 iterations (should never happen)
    if (offset > 100) break;
  }

  // Sort by closeness to `correct` (ascending distance)
  candidates.sort((x, y) => Math.abs(x - correct) - Math.abs(y - correct));

  // Pick 3 with diversity: avoid choosing three values all within distance 1 of each other
  const chosen: number[] = [];
  for (const c of candidates) {
    if (chosen.length === 3) break;
    const tooClose = chosen.length >= 2 && chosen.every((x) => Math.abs(x - c) < 2);
    if (!tooClose) {
      chosen.push(c);
    }
  }

  // If diversity filter was too strict, just take the closest 3
  if (chosen.length < 3) {
    return candidates.slice(0, 3);
  }

  return chosen;
}

/**
 * Builds the full shuffled options array for a multiple-choice question:
 * [correct, ...3 distractors] shuffled with Fisher–Yates.
 */
export function buildOptions(a: number, b: number, correct: number): number[] {
  const distractors = generateDistractors(a, b, correct);
  const options = [correct, ...distractors];
  return fisherYates(options);
}

/** In-place Fisher–Yates shuffle — returns the same array. */
function fisherYates<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
