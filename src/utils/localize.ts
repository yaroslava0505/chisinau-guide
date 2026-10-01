import type { CityEvent, Place } from '../types';
import { DEFAULT_LOCALE, type Locale } from '../i18n/types';

/**
 * Returns the record with its text fields swapped for the active language.
 * Untranslated fields keep their Ukrainian value, so a partially translated
 * catalogue still reads correctly instead of showing blanks.
 *
 * The result is a shallow copy: every downstream component keeps working with
 * a plain `Place` / `CityEvent` and needs no locale awareness of its own.
 */
export function localizePlace(place: Place, locale: Locale): Place {
  if (locale === DEFAULT_LOCALE) return place;

  const translation = place.i18n?.[locale];
  if (!translation) return place;

  return {
    ...place,
    name: translation.name || place.name,
    description: translation.description || place.description,
    subcategory: translation.subcategory || place.subcategory,
    // Keep both languages' tags so a search term from either one still matches.
    tags: [...(place.tags ?? []), ...(translation.tags ?? [])],
  };
}

export function localizeEvent(event: CityEvent, locale: Locale): CityEvent {
  if (locale === DEFAULT_LOCALE) return event;

  const translation = event.i18n?.[locale];
  if (!translation) return event;

  return {
    ...event,
    title: translation.title || event.title,
    description: translation.description || event.description,
    category: translation.category || event.category,
    price: translation.price || event.price,
    date: translation.date || event.date,
    tags: translation.tags ?? event.tags,
  };
}

export const localizePlaces = (places: Place[], locale: Locale): Place[] =>
  locale === DEFAULT_LOCALE ? places : places.map((place) => localizePlace(place, locale));

export const localizeEvents = (events: CityEvent[], locale: Locale): CityEvent[] =>
  locale === DEFAULT_LOCALE ? events : events.map((event) => localizeEvent(event, locale));
