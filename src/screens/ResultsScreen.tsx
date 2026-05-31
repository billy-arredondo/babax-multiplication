import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';
import { getTranslations } from '../i18n';
import { formatTime } from '../lib/timer';

function getStars(accuracy: number): string {
  if (accuracy === 100) return '⭐⭐⭐';
  if (accuracy >= 80) return '⭐⭐';
  if (accuracy >= 50) return '⭐';
  return '';
}

function getMotivationalKey(
  accuracy: number,
): 'motivational100' | 'motivational80' | 'motivational60' | 'motivational40' | 'motivational0' {
  if (accuracy === 100) return 'motivational100';
  if (accuracy >= 80) return 'motivational80';
  if (accuracy >= 60) return 'motivational60';
  if (accuracy >= 40) return 'motivational40';
  return 'motivational0';
}

export function ResultsScreen() {
  const { lang, session, history, startGame, setView } = useGameStore();
  const t = getTranslations(lang);

  // The most recent history entry holds the computed results
  const entry = history[0];

  useEffect(() => {
    if (entry && entry.accuracy >= 80) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [entry]);

  if (!session || !entry) return null;

  const stars = getStars(entry.accuracy);
  const motivationalKey = getMotivationalKey(entry.accuracy);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-4">
      {/* Title + stars */}
      <div className="text-center">
        <h1 className="text-3xl font-black text-purple-800">{t('resultsTitle')}</h1>
        {stars && <p className="text-4xl mt-1">{stars}</p>}
        <p className="mt-2 text-lg font-semibold text-gray-600">{t(motivationalKey)}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label={t('totalQuestions')} value={entry.total} color="bg-indigo-50 text-indigo-700" />
        <StatCard label={t('correctAnswers')} value={entry.correct} color="bg-green-50 text-green-700" />
        <StatCard label={t('incorrectAnswers')} value={entry.total - entry.correct} color="bg-red-50 text-red-600" />
        <StatCard label={t('accuracy')} value={`${entry.accuracy}%`} color="bg-purple-50 text-purple-700" />
        <div className="col-span-2">
          <StatCard label={t('timeUsed')} value={formatTime(entry.timeUsedMs)} color="bg-teal-50 text-teal-700" />
        </div>
      </div>

      {/* Failed questions */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-bold text-gray-700 mb-3">{t('failedTitle')}</h2>
        {entry.failedAnswers.length === 0 ? (
          <p className="text-center text-2xl">{t('noFailed')}</p>
        ) : (
          <div className="space-y-2">
            {entry.failedAnswers.map(({ question, given }, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 bg-red-50 rounded-xl text-sm"
              >
                <span className="font-black text-gray-700">
                  {question.a} × {question.b} = ?
                </span>
                <span className="text-red-500">
                  {t('yourAnswer')}: <strong>{given ?? '—'}</strong>
                </span>
                <span className="text-green-700">
                  {t('correctAns')}: <strong>{question.correct}</strong>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={startGame}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 active:scale-95 transition-all shadow"
        >
          {t('playAgain')}
        </button>
        <button
          onClick={() => setView('admin')}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-purple-300 text-purple-700 font-bold hover:bg-purple-50 active:scale-95 transition-all"
        >
          {t('newGame')}
        </button>
      </div>

      <button
        onClick={() => setView('history')}
        className="w-full py-2 text-sm text-gray-500 hover:text-purple-600 underline"
      >
        {t('goHistory')}
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-center ${color}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-black tabular-nums">{value}</p>
    </div>
  );
}
