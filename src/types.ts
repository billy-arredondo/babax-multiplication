// ─── Core domain types ───────────────────────────────────────────────────────

export type Lang = 'es' | 'en';

export type View = 'admin' | 'player' | 'results' | 'history';

export type AnswerType = 'multiple' | 'keypad';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus = 'idle' | 'running' | 'paused' | 'finished';

// ─── Admin configuration ─────────────────────────────────────────────────────

export interface Config {
  /** Selected tables, e.g. [2, 5, 6] */
  tables: number[];
  /** Number of questions, 1–50 */
  questionCount: number;
  /** Answer interaction mode */
  answerType: AnswerType;
  /** Whether a countdown timer is active */
  timerEnabled: boolean;
  /** Relevant only when timerEnabled === true */
  difficulty: Difficulty;
}

// ─── Game entities ────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  /** Table factor, e.g. 6 */
  a: number;
  /** Multiplier 1–12 */
  b: number;
  /** Correct answer: a * b */
  correct: number;
  /**
   * Exactly 4 shuffled options (1 correct + 3 distractors).
   * Present only when answerType === 'multiple'.
   */
  options?: number[];
}

export interface Answer {
  questionId: string;
  /** null if the question was skipped (timeout / stop) */
  given: number | null;
  isCorrect: boolean;
  /** Wall-clock ms spent on this question (approximate) */
  timeMs: number;
}

// ─── Game session (ephemeral, not persisted) ──────────────────────────────────

export interface GameSession {
  status: GameStatus;
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  /** Total allowed time in ms (set at start, only relevant when timerEnabled) */
  totalTimeMs: number;
  /**
   * Accumulated elapsed ms at the last pause/freeze point.
   * The actual current elapsed is:
   *   elapsedMs + (Date.now() - startTimestamp)   if status === 'running'
   *   elapsedMs                                   otherwise
   */
  elapsedMs: number;
  /** performance.now() timestamp when the current run segment started, or null if paused */
  startTimestamp: number | null;
  /** Timestamp (performance.now()) when the current question was shown */
  questionStartTimestamp: number | null;
}

// ─── Persistence ─────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  dateISO: string;
  config: Config;
  total: number;
  correct: number;
  /** Accuracy 0–100 */
  accuracy: number;
  timeUsedMs: number;
  /** Failed questions stored for review */
  failedAnswers: FailedAnswer[];
}

export interface FailedAnswer {
  question: Question;
  given: number | null;
}

// ─── Timer helpers ────────────────────────────────────────────────────────────

/** Seconds per question per difficulty level */
export const SECONDS_PER_QUESTION: Record<Difficulty, number> = {
  easy: 12,
  medium: 8,
  hard: 5,
};
