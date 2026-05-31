import { SECONDS_PER_QUESTION, type Difficulty } from '../types';

/**
 * Formats milliseconds into `mm:ss.d` display string.
 * Examples: 134_300 ms → "02:14.3", 5_000 ms → "00:05.0"
 */
export function formatTime(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalDec = Math.floor(clamped / 100);
  const tenths = totalDec % 10;
  const totalSec = Math.floor(clamped / 1000);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  return `${pad2(min)}:${pad2(sec)}.${tenths}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Computes the total allowed time in milliseconds for a given
 * difficulty level and question count.
 */
export function computeTotalTimeMs(difficulty: Difficulty, questionCount: number): number {
  return SECONDS_PER_QUESTION[difficulty] * questionCount * 1000;
}

/**
 * Given the session's timer state, returns the current elapsed milliseconds.
 * Uses performance.now() for sub-millisecond precision.
 */
export function computeElapsedMs(
  elapsedMs: number,
  startTimestamp: number | null,
): number {
  if (startTimestamp === null) return elapsedMs;
  return elapsedMs + (performance.now() - startTimestamp);
}

/**
 * Returns remaining ms for a countdown timer.
 * Returns 0 if already expired.
 */
export function computeRemainingMs(
  totalTimeMs: number,
  elapsedMs: number,
  startTimestamp: number | null,
): number {
  return Math.max(0, totalTimeMs - computeElapsedMs(elapsedMs, startTimestamp));
}
