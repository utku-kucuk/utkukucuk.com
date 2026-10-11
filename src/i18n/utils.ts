import { defaultLocale, languages, ui, type Locale, type UIKey } from './ui';

export function getLocale(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return first && first in languages ? (first as Locale) : defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}

/** Prefix an internal path with the locale segment (default locale has no prefix). */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
}

/** Return the same page path in another locale. */
export function switchLocalePath(url: URL, target: Locale): string {
  const current = getLocale(url);
  const withoutLocale =
    current === defaultLocale
      ? url.pathname
      : url.pathname.replace(new RegExp(`^/${current}`), '') || '/';
  return localizePath(withoutLocale, target);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'tr' : 'en';
}
