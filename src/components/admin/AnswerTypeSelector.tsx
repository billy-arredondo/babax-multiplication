import { useGameStore } from '../../store/gameStore';
import { getTranslations } from '../../i18n';
import { type AnswerType } from '../../types';

export function AnswerTypeSelector() {
  const { lang, config, updateConfig } = useGameStore();
  const t = getTranslations(lang);

  const options: { value: AnswerType; icon: string; key: 'multipleChoice' | 'keypadInput' }[] = [
    { value: 'multiple', icon: '🔵', key: 'multipleChoice' },
    { value: 'keypad', icon: '🔢', key: 'keypadInput' },
  ];

  return (
    <div>
      <span className="font-semibold text-gray-700 block mb-2">{t('answerType')}</span>
      <div className="flex gap-3">
        {options.map(({ value, icon, key }) => (
          <button
            key={value}
            onClick={() => updateConfig({ answerType: value })}
            aria-pressed={config.answerType === value}
            className={[
              'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition-all text-sm',
              config.answerType === value
                ? 'bg-indigo-500 text-white border-indigo-500 shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50',
            ].join(' ')}
          >
            <span>{icon}</span>
            <span>{t(key)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
