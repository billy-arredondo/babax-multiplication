import { useEffect, useRef } from 'react';
import { useGameStore } from './store/gameStore';
import { getTranslations } from './i18n';
import { updateFavicon, initFaviconCycle } from './lib/favicon';
import { LanguageToggle } from './components/common/LanguageToggle';
import { AdminScreen } from './screens/AdminScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { HistoryScreen } from './screens/HistoryScreen';

export default function App() {
  const { lang, view } = useGameStore();
  const t = getTranslations(lang);

  // Keep a ref so the interval callback always reads the current view
  const viewRef = useRef(view);
  viewRef.current = view;

  // Start the 15-second burst cycle once on mount; clean up on unmount
  useEffect(() => {
    return initFaviconCycle(() => viewRef.current === 'player');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Immediately update the static favicon whenever the view changes
  useEffect(() => {
    updateFavicon(view === 'player');
  }, [view]);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-purple-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none">🦊</span>
          <span className="font-black text-purple-800 text-lg leading-tight">
            {t('appTitle')}
          </span>
        </div>
        <LanguageToggle />
      </header>

      {/* View router */}
      <main className="py-4">
        {view === 'admin' && <AdminScreen />}
        {view === 'player' && <PlayerScreen />}
        {view === 'results' && <ResultsScreen />}
        {view === 'history' && <HistoryScreen />}
      </main>
    </div>
  );
}
