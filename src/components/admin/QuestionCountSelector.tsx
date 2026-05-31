import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getTranslations } from '../../i18n';

const PRESETS = [5, 10, 15, 20, 25, 30];

export function QuestionCountSelector() {
  const { lang, config, updateConfig } = useGameStore();
  const t = getTranslations(lang);
  const [customMode, setCustomMode] = useState(false);
  const [customVal, setCustomVal] = useState('');

  const isPreset = PRESETS.includes(config.questionCount);

  function handlePreset(n: number) {
    setCustomMode(false);
    setCustomVal('');
    updateConfig({ questionCount: n });
  }

  function handleCustom() {
    setCustomMode(true);
    setCustomVal(String(config.questionCount));
  }

  function applyCustom(raw: string) {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1 && n <= 100) {
      updateConfig({ questionCount: n });
    }
  }

  return (
    <div>
      <span className="font-semibold text-gray-700 block mb-2">{t('questionCount')}</span>
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((n) => (
          <button
            key={n}
            onClick={() => handlePreset(n)}
            className={[
              'px-4 py-2 rounded-xl font-bold border-2 transition-all text-sm',
              !customMode && config.questionCount === n
                ? 'bg-pink-500 text-white border-pink-500 shadow'
                : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300 hover:bg-pink-50',
            ].join(' ')}
          >
            {n}
          </button>
        ))}

        {/* Custom input */}
        {customMode ? (
          <input
            type="number"
            min={1}
            max={100}
            value={customVal}
            autoFocus
            onChange={(e) => setCustomVal(e.target.value)}
            onBlur={(e) => { applyCustom(e.target.value); setCustomMode(false); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { applyCustom(customVal); setCustomMode(false); }
              if (e.key === 'Escape') setCustomMode(false);
            }}
            className="w-20 px-2 py-2 rounded-xl border-2 border-pink-400 text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder={t('customPlaceholder')}
          />
        ) : (
          <button
            onClick={handleCustom}
            className={[
              'px-4 py-2 rounded-xl font-bold border-2 transition-all text-sm',
              !isPreset
                ? 'bg-pink-500 text-white border-pink-500 shadow'
                : 'bg-white text-gray-500 border-dashed border-gray-300 hover:border-pink-300',
            ].join(' ')}
          >
            {!isPreset ? config.questionCount : t('customCount')}
          </button>
        )}
      </div>
    </div>
  );
}
