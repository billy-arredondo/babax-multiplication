import { useGameStore } from '../../store/gameStore';
import { getTranslations } from '../../i18n';
import { type Difficulty, SECONDS_PER_QUESTION } from '../../types';
import { formatTime } from '../../lib/timer';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const DIFF_KEY = { easy: 'easy', medium: 'medium', hard: 'hard' } as const;

export function TimerConfig() {
  const { lang, config, updateConfig } = useGameStore();
  const t = getTranslations(lang);

  const estimatedMs =
    SECONDS_PER_QUESTION[config.difficulty] * config.questionCount * 1000;

  return (
    <div>
      <span className="font-semibold text-gray-700 block mb-2">{t('timerSection')}</span>

      {/* On/Off toggle */}
      <div className="flex gap-3 mb-3">
        {[false, true].map((val) => (
          <button
            key={String(val)}
            onClick={() => updateConfig({ timerEnabled: val })}
            aria-pressed={config.timerEnabled === val}
            className={[
              'flex-1 py-2 rounded-xl border-2 font-semibold text-sm transition-all',
              config.timerEnabled === val
                ? 'bg-teal-500 text-white border-teal-500 shadow'
                : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300',
            ].join(' ')}
          >
            {val ? `⏱ ${t('timerOn')}` : `∞ ${t('timerOff')}`}
          </button>
        ))}
      </div>

      {/* Difficulty selector – only shown when timer is on */}
      {config.timerEnabled && (
        <div className="space-y-2">
          <span className="text-sm text-gray-600">{t('difficulty')}</span>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => updateConfig({ difficulty: d })}
                aria-pressed={config.difficulty === d}
                className={[
                  'flex-1 py-2 rounded-xl border-2 font-bold text-sm transition-all',
                  config.difficulty === d
                    ? d === 'easy'
                      ? 'bg-green-500 text-white border-green-500 shadow'
                      : d === 'medium'
                        ? 'bg-yellow-400 text-white border-yellow-400 shadow'
                        : 'bg-red-500 text-white border-red-500 shadow'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
                ].join(' ')}
              >
                {t(DIFF_KEY[d])}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-right">
            {t('estimatedTime')}: <span className="font-mono font-bold text-teal-600">{formatTime(estimatedMs)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
