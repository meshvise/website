import fr from './fr.json';
import en from './en.json';

const translations: Record<string, typeof fr> = { fr, en };

export type Lang = 'fr' | 'en';
export const defaultLang: Lang = 'fr';
export const languages: Lang[] = ['fr', 'en'];

export function t(lang: Lang, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[lang];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (languages.includes(lang as Lang)) return lang as Lang;
  return defaultLang;
}

export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const [, , ...rest] = url.pathname.split('/');
  return `/${targetLang}/${rest.join('/')}`;
}
