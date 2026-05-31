import { History } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getTranslations } from '../i18n';
import { TableSelector } from '../components/admin/TableSelector';
import { QuestionCountSelector } from '../components/admin/QuestionCountSelector';
import { AnswerTypeSelector } from '../components/admin/AnswerTypeSelector';
import { TimerConfig } from '../components/admin/TimerConfig';

export function AdminScreen() {
  const { lang, config, startGame, setView } = useGameStore();
  const t = getTranslations(lang);

  const canStart = config.tables.length > 0;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-black text-purple-800 text-center">{t('adminTitle')}</h1>

      <div className="bg-white rounded-2xl shadow p-4">
        <TableSelector />
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <QuestionCountSelector />
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <AnswerTypeSelector />
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <TimerConfig />
      </div>

      <button
        onClick={startGame}
        disabled={!canStart}
        className={[
          'w-full py-4 rounded-2xl text-xl font-black transition-all shadow-lg',
          canStart
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed',
        ].join(' ')}
        title={!canStart ? t('startDisabled') : undefined}
      >
        {canStart ? t('startGame') : t('startDisabled')}
      </button>

      <button
        onClick={() => setView('history')}
        className="w-full py-2 flex items-center justify-center gap-2 text-gray-500 hover:text-purple-600 text-sm"
      >
        <History size={16} />
        {t('viewHistory')}
      </button>
    </div>
  );
}
