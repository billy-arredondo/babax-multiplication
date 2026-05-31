import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type Lang,
  type View,
  type Config,
  type GameSession,
  type HistoryEntry,
  type FailedAnswer,
  type Answer,
} from '../types';
import { generateQuestions } from '../lib/questionGenerator';
import { computeTotalTimeMs } from '../lib/timer';
import { loadHistory, saveHistory, clearHistory } from '../lib/storage';

// ─── Persisted slice (config + lang) ─────────────────────────────────────────

interface PersistedSlice {
  lang: Lang;
  config: Config;
}

// ─── Full store ───────────────────────────────────────────────────────────────

interface GameStore extends PersistedSlice {
  view: View;
  session: GameSession | null;
  history: HistoryEntry[];

  // ── Lang ──────────────────────────────────────────────────────────────────
  setLang: (lang: Lang) => void;

  // ── View ──────────────────────────────────────────────────────────────────
  setView: (view: View) => void;

  // ── Config ────────────────────────────────────────────────────────────────
  updateConfig: (patch: Partial<Config>) => void;

  // ── Game flow ─────────────────────────────────────────────────────────────
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  stopGame: () => void;

  /** Record the player's answer for the current question and advance */
  submitAnswer: (given: number | null) => void;

  /** Called by the timer loop to detect timeout */
  tickTimer: () => void;

  // ── History ───────────────────────────────────────────────────────────────
  loadStoredHistory: () => void;
  clearStoredHistory: () => void;
}

// ─── Default config ───────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Config = {
  tables: [2, 3, 4, 5],
  questionCount: 10,
  answerType: 'multiple',
  timerEnabled: false,
  difficulty: 'medium',
};

// ─── Internal helper ──────────────────────────────────────────────────────────

function finalizeSession(
  finalSession: GameSession,
  config: Config,
  history: HistoryEntry[],
  set: (state: Partial<GameStore>) => void,
) {
  const correct = finalSession.answers.filter((a) => a.isCorrect).length;
  const total = finalSession.questions.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const failedAnswers: FailedAnswer[] = finalSession.answers
    .filter((a) => !a.isCorrect)
    .map((a) => ({
      question: finalSession.questions.find((q) => q.id === a.questionId)!,
      given: a.given,
    }));

  const entry: HistoryEntry = {
    id: `h_${Date.now()}`,
    dateISO: new Date().toISOString(),
    config: { ...config },
    total,
    correct,
    accuracy,
    timeUsedMs: Math.round(finalSession.elapsedMs),
    failedAnswers,
  };

  const newHistory = [entry, ...history].slice(0, 50); // Keep last 50 entries
  saveHistory(newHistory);
  set({ session: finalSession, history: newHistory, view: 'results' });
}

// ─── Store implementation ─────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────
      lang: 'es' as Lang,
      config: DEFAULT_CONFIG,
      view: 'admin' as View,
      session: null,
      history: loadHistory(),

      // ── Lang ───────────────────────────────────────────────────────────
      setLang: (lang) => set({ lang }),

      // ── View ───────────────────────────────────────────────────────────
      setView: (view) => set({ view }),

      // ── Config ─────────────────────────────────────────────────────────
      updateConfig: (patch) =>
        set((s) => ({ config: { ...s.config, ...patch } })),

      // ── Game flow ──────────────────────────────────────────────────────
      startGame: () => {
        const { config } = get();
        const questions = generateQuestions(
          config.tables,
          config.questionCount,
          config.answerType,
        );
        const totalTimeMs = config.timerEnabled
          ? computeTotalTimeMs(config.difficulty, config.questionCount)
          : 0;

        const session: GameSession = {
          status: 'running',
          questions,
          currentIndex: 0,
          answers: [],
          totalTimeMs,
          elapsedMs: 0,
          startTimestamp: performance.now(),
          questionStartTimestamp: performance.now(),
        };
        set({ session, view: 'player' });
      },

      pauseGame: () => {
        const { session } = get();
        if (!session || session.status !== 'running') return;
        const elapsed =
          session.elapsedMs +
          (session.startTimestamp !== null
            ? performance.now() - session.startTimestamp
            : 0);
        set({
          session: {
            ...session,
            status: 'paused',
            elapsedMs: elapsed,
            startTimestamp: null,
          },
        });
      },

      resumeGame: () => {
        const { session } = get();
        if (!session || session.status !== 'paused') return;
        set({
          session: {
            ...session,
            status: 'running',
            startTimestamp: performance.now(),
          },
        });
      },

      stopGame: () => {
        const { session, config, history } = get();
        if (!session) return;
        const elapsed =
          session.status === 'running' && session.startTimestamp !== null
            ? session.elapsedMs + (performance.now() - session.startTimestamp)
            : session.elapsedMs;

        // Mark remaining unanswered questions as null/incorrect
        const answered = new Set(session.answers.map((a) => a.questionId));
        const remaining: Answer[] = session.questions
          .filter((q) => !answered.has(q.id))
          .map((q) => ({ questionId: q.id, given: null, isCorrect: false, timeMs: 0 }));

        const finalSession: GameSession = {
          ...session,
          status: 'finished',
          elapsedMs: elapsed,
          startTimestamp: null,
          answers: [...session.answers, ...remaining],
        };
        finalizeSession(finalSession, config, history, set);
      },

      submitAnswer: (given: number | null) => {
        const { session, config, history } = get();
        if (!session || session.status !== 'running') return;

        const currentQ = session.questions[session.currentIndex];
        if (!currentQ) return;

        const isCorrect = given !== null && given === currentQ.correct;
        const questionTimeMs =
          session.questionStartTimestamp !== null
            ? performance.now() - session.questionStartTimestamp
            : 0;

        const newAnswer: Answer = {
          questionId: currentQ.id,
          given,
          isCorrect,
          timeMs: Math.round(questionTimeMs),
        };

        const answers = [...session.answers, newAnswer];
        const nextIndex = session.currentIndex + 1;
        const isLast = nextIndex >= session.questions.length;

        if (isLast) {
          const elapsed =
            session.elapsedMs +
            (session.startTimestamp !== null
              ? performance.now() - session.startTimestamp
              : 0);
          const finalSession: GameSession = {
            ...session,
            status: 'finished',
            currentIndex: nextIndex,
            answers,
            elapsedMs: elapsed,
            startTimestamp: null,
          };
          finalizeSession(finalSession, config, history, set);
        } else {
          set({
            session: {
              ...session,
              currentIndex: nextIndex,
              answers,
              questionStartTimestamp: performance.now(),
            },
          });
        }
      },

      tickTimer: () => {
        const { session, config, history } = get();
        if (!session || session.status !== 'running' || !config.timerEnabled) return;

        const elapsed =
          session.elapsedMs +
          (session.startTimestamp !== null
            ? performance.now() - session.startTimestamp
            : 0);

        if (elapsed >= session.totalTimeMs) {
          // Time's up — mark all remaining questions
          const answered = new Set(session.answers.map((a) => a.questionId));
          const remaining: Answer[] = session.questions
            .filter((q) => !answered.has(q.id))
            .map((q) => ({
              questionId: q.id,
              given: null,
              isCorrect: false,
              timeMs: 0,
            }));

          const finalSession: GameSession = {
            ...session,
            status: 'finished',
            elapsedMs: session.totalTimeMs,
            startTimestamp: null,
            answers: [...session.answers, ...remaining],
          };
          finalizeSession(finalSession, config, history, set);
        }
      },

      // ── History ────────────────────────────────────────────────────────
      loadStoredHistory: () => {
        set({ history: loadHistory() });
      },

      clearStoredHistory: () => {
        clearHistory();
        set({ history: [] });
      },
    }),
    {
      name: 'babax-config',
      partialize: (state): PersistedSlice => ({
        lang: state.lang,
        config: state.config,
      }),
    },
  ),
);
