import { Pause, Play, StopCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { getTranslations } from '../../i18n';

export function GameControls() {
  const { lang, session, pauseGame, resumeGame, stopGame } = useGameStore();
  const t = getTranslations(lang);

  if (!session) return null;

  const isRunning = session.status === 'running';
  const isPaused = session.status === 'paused';

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Pause / Resume */}
      {isRunning ? (
        <button
          onClick={pauseGame}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400 text-yellow-900 font-bold hover:bg-yellow-500 transition-colors shadow"
        >
          <Pause size={18} />
          {t('pause')}
        </button>
      ) : isPaused ? (
        <button
          onClick={resumeGame}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow"
        >
          <Play size={18} />
          {t('resume')}
        </button>
      ) : null}

      {/* Stop */}
      <button
        onClick={() => {
          if (window.confirm('¿Terminar la partida?')) stopGame();
        }}
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors shadow border border-red-200"
      >
        <StopCircle size={18} />
        {t('stop')}
      </button>
    </div>
  );
}
