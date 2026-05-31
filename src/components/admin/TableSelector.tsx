import { useGameStore } from '../../store/gameStore';
import { getTranslations } from '../../i18n';

const ALL_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function TableSelector() {
  const { lang, config, updateConfig } = useGameStore();
  const t = getTranslations(lang);

  function toggle(n: number) {
    const current = config.tables;
    const next = current.includes(n) ? current.filter((x) => x !== n) : [...current, n].sort((a, b) => a - b);
    updateConfig({ tables: next });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700">{t('selectTables')}</span>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => updateConfig({ tables: [...ALL_TABLES] })}
            className="text-purple-600 hover:underline"
          >
            {t('selectAll')}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => updateConfig({ tables: [] })}
            className="text-pink-500 hover:underline"
          >
            {t('clearAll')}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {ALL_TABLES.map((n) => {
          const selected = config.tables.includes(n);
          return (
            <button
              key={n}
              onClick={() => toggle(n)}
              aria-pressed={selected}
              className={[
                'rounded-xl py-2 text-lg font-bold border-2 transition-all duration-150 select-none',
                selected
                  ? 'bg-purple-500 text-white border-purple-500 shadow-md scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50',
              ].join(' ')}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
