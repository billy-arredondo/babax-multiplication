import { type HistoryEntry } from '../types';

const HISTORY_KEY = 'babax_history';

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // Gracefully ignore quota errors
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
