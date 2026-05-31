import { Trash2, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getTranslations } from '../i18n';
import { formatTime } from '../lib/timer';

export function HistoryScreen() {
  const { lang, history, clearStoredHistory, setView } = useGameStore();
  const t = getTranslations(lang);

  function handleClear() {
    if (window.confirm(t('confirmClear'))) {
      clearStoredHistory();
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('admin')}
          className="flex items-center gap-1 text-purple-600 font-semibold hover:underline"
        >
          <ArrowLeft size={18} />
          {t('backToAdmin')}
        </button>
        <h1 className="text-xl font-black text-purple-800">{t('historyTitle')}</h1>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-red-400 hover:text-red-600"
            aria-label={t('clearHistory')}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-center text-gray-400 py-12">{t('historyEmpty')}</p>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => {
            const date = new Date(entry.dateISO);
            const dateStr = date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            const timeStr = date.toLocaleTimeString(lang === 'es' ? 'es-ES' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const accuracyColor =
              entry.accuracy === 100
                ? 'text-green-600'
                : entry.accuracy >= 70
                  ? 'text-yellow-600'
                  : 'text-red-500';

            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl shadow p-4 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {dateStr} · {timeStr}
                  </span>
                  <span className={`text-xl font-black ${accuracyColor}`}>
                    {entry.accuracy}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {t('historyTables')}: <strong>{entry.config.tables.join(', ')}</strong>
                  </span>
                  <span className="text-gray-500">
                    {entry.correct}/{entry.total} · {formatTime(entry.timeUsedMs)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
