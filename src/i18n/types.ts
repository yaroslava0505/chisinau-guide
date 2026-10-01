export type Locale = 'uk' | 'ru' | 'ro';

/**
 * Display order: Russian and Romanian first, Ukrainian last. Everything that
 * lists the languages — the switcher, hreflang tags, the sitemap, the admin
 * translation fields — follows this array.
 */
export const LOCALES: Locale[] = ['ru', 'ro', 'uk'];

/**
 * Ukrainian is still the language served from the root path; ru and ro are
 * prefixed. The order above is presentation only and does not change routing.
 */
export const DEFAULT_LOCALE: Locale = 'uk';

export interface LocaleMeta {
  /** Two-letter code shown in the switcher. */
  short: string;
  /** Endonym — the language's own name. */
  name: string;
  /** Value for <html lang> and hreflang. */
  htmlLang: string;
  /** URL prefix; empty for the default locale. */
  prefix: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  uk: { short: 'UA', name: 'Українська', htmlLang: 'uk', prefix: '' },
  ru: { short: 'RU', name: 'Русский', htmlLang: 'ru', prefix: '/ru' },
  ro: { short: 'RO', name: 'Română', htmlLang: 'ro', prefix: '/ro' },
};

export const isLocale = (value: string): value is Locale =>
  (LOCALES as string[]).includes(value);

/**
 * A piece of catalogue content in every supported language.
 * Only the default locale is required; missing translations fall back to it.
 */
export type Translated = Partial<Record<Locale, string>>;
