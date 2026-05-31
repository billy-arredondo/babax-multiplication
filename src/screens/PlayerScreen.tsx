import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { getTranslations } from '../i18n';
import { computeElapsedMs, computeRemainingMs } from '../lib/timer';
import { QuestionCard } from '../components/player/QuestionCard';
import { MultipleChoiceAnswers } from '../components/player/MultipleChoiceAnswers';
import { NumericKeypad } from '../components/player/NumericKeypad';
import { GameControls } from '../components/player/GameControls';
import { ProgressBar } from '../components/common/ProgressBar';
import { TimerDisplay } from '../components/common/TimerDisplay';
import { FeedbackOverlay } from '../components/player/FeedbackOverlay';

const FEEDBACK_DURATION_MS = 900;

export function PlayerScreen() {
  const { lang, config, session, submitAnswer, tickTimer } = useGameStore();
  const t = getTranslations(lang);

  // Local display timer (re-renders every 100ms)
  const [displayMs, setDisplayMs] = useState(0);
  const rafRef = useRef<number>(0);

  // Feedback state
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    isCorrect: boolean;
    correctAnswer: number;
  }>({ visible: false, isCorrect: false, correctAnswer: 0 });
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awaitingNextRef = useRef(false);

  // Tick the visual timer + check timeout
  const tick = useCallback(() => {
    if (!session) return;
    if (session.status === 'running') {
      const elapsed = computeElapsedMs(session.elapsedMs, session.startTimestamp);
      const ms = config.timerEnabled
        ? computeRemainingMs(session.totalTimeMs, session.elapsedMs, session.startTimestamp)
        : elapsed;
      setDisplayMs(ms);
      tickTimer(); // check timeout
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [session, config.timerEnabled, tickTimer]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  if (!session) return null;

  const currentQ = session.questions[session.currentIndex];
  const isPaused = session.status === 'paused';
  const inputDisabled = isPaused || awaitingNextRef.current || !currentQ;

  function handleAnswer(given: number) {
    if (!currentQ || awaitingNextRef.current) return;
    const isCorrect = given === currentQ.correct;
    awaitingNextRef.current = true;

    setFeedback({ visible: true, isCorrect, correctAnswer: currentQ.correct });

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback((f) => ({ ...f, visible: false }));
      awaitingNextRef.current = false;
      submitAnswer(given);
    }, FEEDBACK_DURATION_MS);
  }

  const displayIndex = Math.min(session.currentIndex, session.questions.length - 1);
  const displayQ = session.questions[displayIndex];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Header: progress + timer */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500">
          {t('question')} {session.currentIndex + 1} {t('of')} {session.questions.length}
        </span>
        <TimerDisplay
          ms={displayMs}
          countdown={config.timerEnabled}
          label={config.timerEnabled ? t('timeLeft') : t('elapsed')}
        />
      </div>

      <ProgressBar
        current={session.currentIndex}
        total={session.questions.length}
        label=""
      />

      {/* Question card */}
      {displayQ && (
        <QuestionCard question={displayQ} animKey={session.currentIndex} />
      )}

      {/* Paused banner */}
      {isPaused && (
        <div className="text-center py-3 px-6 bg-yellow-100 rounded-2xl text-yellow-700 font-bold text-lg animate-bounce-in">
          {t('paused')}
        </div>
      )}

      {/* Answer input */}
      {displayQ && config.answerType === 'multiple' && (
        <MultipleChoiceAnswers
          question={displayQ}
          onAnswer={handleAnswer}
          disabled={inputDisabled}
        />
      )}
      {displayQ && config.answerType === 'keypad' && (
        <NumericKeypad onAnswer={handleAnswer} disabled={inputDisabled} />
      )}

      {/* Controls */}
      <GameControls />

      {/* Feedback overlay */}
      <FeedbackOverlay
        isCorrect={feedback.isCorrect}
        correctAnswer={feedback.correctAnswer}
        visible={feedback.visible}
      />
    </div>
  );
}
