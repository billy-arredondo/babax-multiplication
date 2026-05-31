import { getTranslations } from '../../i18n';
import { useGameStore } from '../../store/gameStore';

interface FeedbackOverlayProps {
  isCorrect: boolean;
  correctAnswer: number;
  visible: boolean;
}

export function FeedbackOverlay({ isCorrect, correctAnswer, visible }: FeedbackOverlayProps) {
  const { lang } = useGameStore();
  const t = getTranslations(lang);

  if (!visible) return null;

  return (
    <div
      className={[
        'fixed inset-0 flex flex-col items-center justify-center z-50 pointer-events-none',
        'animate-bounce-in',
      ].join(' ')}
    >
      <div
        className={[
          'px-10 py-6 rounded-3xl shadow-2xl text-white text-center',
          isCorrect ? 'bg-green-500' : 'bg-red-400',
        ].join(' ')}
      >
        <p className="text-4xl font-black mb-1">{isCorrect ? t('correct') : t('incorrect')}</p>
        {!isCorrect && (
          <p className="text-lg">
            {t('correctAnswer')}: <span className="font-black text-2xl">{correctAnswer}</span>
          </p>
        )}
      </div>
    </div>
  );
}
