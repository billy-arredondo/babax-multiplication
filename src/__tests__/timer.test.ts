import { describe, it, expect } from 'vitest';
import { formatTime, computeTotalTimeMs } from '../lib/timer';

describe('formatTime', () => {
  it('formats zero as 00:00.0', () => {
    expect(formatTime(0)).toBe('00:00.0');
  });

  it('formats 134_300 ms as 02:14.3', () => {
    expect(formatTime(134_300)).toBe('02:14.3');
  });

  it('formats exactly 1 minute', () => {
    expect(formatTime(60_000)).toBe('01:00.0');
  });

  it('formats 5_000 ms as 00:05.0', () => {
    expect(formatTime(5_000)).toBe('00:05.0');
  });

  it('formats tenths correctly', () => {
    expect(formatTime(1_500)).toBe('00:01.5');
    expect(formatTime(1_900)).toBe('00:01.9');
    expect(formatTime(1_999)).toBe('00:01.9');
    expect(formatTime(2_000)).toBe('00:02.0');
  });

  it('handles negative values (clamps to 0)', () => {
    expect(formatTime(-5000)).toBe('00:00.0');
  });

  it('pads single-digit minutes and seconds', () => {
    expect(formatTime(3_000)).toBe('00:03.0');
    expect(formatTime(70_000)).toBe('01:10.0');
  });
});

describe('computeTotalTimeMs', () => {
  it('easy: 12s per question', () => {
    expect(computeTotalTimeMs('easy', 10)).toBe(120_000);
  });

  it('medium: 8s per question', () => {
    expect(computeTotalTimeMs('medium', 10)).toBe(80_000);
  });

  it('hard: 5s per question', () => {
    expect(computeTotalTimeMs('hard', 10)).toBe(50_000);
  });

  it('scales linearly with question count', () => {
    expect(computeTotalTimeMs('medium', 20)).toBe(160_000);
  });
});
