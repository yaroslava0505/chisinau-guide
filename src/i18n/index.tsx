import React, { createContext, useContext, useMemo } from 'react';
import { DEFAULT_LOCALE, LOCALES, type Locale, type Translated, isLocale } from './types';
import { uk, type Dictionary } from './dictionaries/uk';
import { ru } from './dictionaries/ru';
import { ro } from './dictionaries/ro';

export * from './types';
export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { uk, ru, ro };

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue>({ locale: DEFAULT_LOCALE, t: uk });

export const LocaleProvider: React.FC<{ locale: Locale; children: React.ReactNode }> = ({
  locale,
  children,
}) => {
  const value = useMemo(() => ({ locale, t: DICTIONARIES[locale] }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => useContext(LocaleContext);

/** Convenience hook for components that only need the strings. */
export const useT = () => useContext(LocaleContext).t;

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];

const LOCALE_STORAGE_KEY = 'chisinau_locale';

/**
 * The language the visitor picked in the switcher on a previous visit.
 *
 * Deliberately *not* browser-language sniffing: `/` is always the Ukrainian
 * page for first-time visitors and for crawlers, so the canonical URL stays
 * predictable. Only an explicit earlier choice moves someone off the root.
 */
export function getRememberedLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored && isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function rememberLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Not being able to remember the choice is not worth breaking navigation.
  }
}

/**
 * Resolves a translated catalogue field, falling back to Ukrainian when a
 * translation has not been filled in yet — a half-translated catalogue should
 * still read correctly rather than showing blanks.
 */
export function pick(field: Translated | string | undefined, locale: Locale): string {
  if (typeof field === 'string') return field;
  if (!field) return '';
  return field[locale] ?? field[DEFAULT_LOCALE] ?? Object.values(field).find(Boolean) ?? '';
}

export { LOCALES, DEFAULT_LOCALE, isLocale };
export type { Locale, Translated };
