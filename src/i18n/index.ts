import { es, type TranslationKey } from './es';
import { en } from './en';
import { type Lang } from '../types';

export type { TranslationKey };

const translations: Record<Lang, Record<TranslationKey, string>> = {
  es,
  en,
};

/**
 * Returns a translation function bound to `lang`.
 * Usage: const t = useT(); t('startGame');
 */
export function getTranslations(lang: Lang): (key: TranslationKey) => string {
  const dict = translations[lang];
  return (key) => dict[key] ?? key;
}
