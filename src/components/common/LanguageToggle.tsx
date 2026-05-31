import { useGameStore } from '../../store/gameStore';
import { getTranslations } from '../../i18n';

export function LanguageToggle() {
  const { lang, setLang } = useGameStore();
  const t = getTranslations(lang);

  return (
    <button
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      className="px-3 py-1 rounded-full text-sm font-bold border-2 border-purple-400 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
      aria-label={`Switch to ${t('langToggle')}`}
    >
      {t('langToggle')}
    </button>
  );
}
