import { Place, CityEvent } from '../types';
import { INITIAL_PLACES, INITIAL_EVENTS } from '../data/chisinauPlaces';

/**
 * Storage keys are versioned. `v3` ships alongside the Russian and Romanian
 * translations stored on each record; a `v2` payload would leave the whole
 * catalogue untranslated, so it is replaced rather than migrated. Old keys are
 * removed on first boot.
 */
const PLACES_STORAGE_KEY = 'chisinau_places_v3';
const EVENTS_STORAGE_KEY = 'chisinau_events_v3';
const FAVORITES_STORAGE_KEY = 'chisinau_favorites_v1';

const LEGACY_KEYS = [
  'chisinau_places_v1',
  'chisinau_events_v1',
  'chisinau_places_v2',
  'chisinau_events_v2',
];

export function clearLegacyStorage(): void {
  try {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch (err) {
    console.error('Error clearing legacy storage', err);
  }
}

function readCollection<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T[]) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
}

function writeCollection<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
}

/**
 * Ids the editor removed. Without this list, records deleted in the admin
 * panel would reappear on the next boot, because the merge below re-adds every
 * catalogue entry that is missing from storage.
 */
const DELETED_IDS_KEY = 'chisinau_deleted_v1';

function getDeletedIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Ids the editor changed by hand. Records not in this list are refreshed from
 * the shipped catalogue on every boot, so corrections to existing places reach
 * visitors who already have the catalogue cached.
 */
const EDITED_IDS_KEY = 'chisinau_edited_v1';

function getEditedIds(): string[] {
  try {
    const raw = localStorage.getItem(EDITED_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rememberEditedId(id: string): void {
  try {
    const ids = getEditedIds();
    if (!ids.includes(id)) {
      localStorage.setItem(EDITED_IDS_KEY, JSON.stringify([...ids, id]));
    }
  } catch (err) {
    console.error('Error recording edited id', err);
  }
}

export function rememberDeletedId(id: string): void {
  try {
    const ids = getDeletedIds();
    if (!ids.includes(id)) {
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...ids, id]));
    }
  } catch (err) {
    console.error('Error recording deleted id', err);
  }
}

/**
 * Reconciles the shipped catalogue with what this browser has stored.
 *
 *  - records the editor changed keep the stored version;
 *  - every other known record is refreshed from the catalogue, so corrections
 *    to descriptions, hours or translations actually reach returning visitors;
 *  - records the editor added stay;
 *  - new catalogue records are appended, unless the editor deleted them.
 *
 * Without this, the first visit would freeze the catalogue in that browser
 * forever and no content update would ever ship.
 */
function mergeWithCatalogue<T extends { id: string }>(stored: T[], catalogue: T[]): T[] {
  const edited = new Set(getEditedIds());
  const deleted = new Set(getDeletedIds());
  const fromCatalogue = new Map(catalogue.map((item) => [item.id, item]));

  const reconciled = stored.map((item) => {
    const shipped = fromCatalogue.get(item.id);
    return shipped && !edited.has(item.id) ? shipped : item;
  });

  const known = new Set(stored.map((item) => item.id));
  const additions = catalogue.filter((item) => !known.has(item.id) && !deleted.has(item.id));

  return [...reconciled, ...additions];
}

/* ----------------------------- Places ----------------------------- */

export function getStoredPlaces(): Place[] {
  const stored = readCollection(PLACES_STORAGE_KEY, INITIAL_PLACES);
  const merged = mergeWithCatalogue(stored, INITIAL_PLACES);
  if (merged.some((item, i) => item !== stored[i]) || merged.length !== stored.length) {
    writeCollection(PLACES_STORAGE_KEY, merged);
  }
  return merged;
}

export function saveStoredPlaces(places: Place[]): void {
  writeCollection(PLACES_STORAGE_KEY, places);
}

export function resetStoredPlaces(): Place[] {
  // A reset also forgets deletions and edits, otherwise "restore demo" would
  // not actually restore.
  try {
    localStorage.removeItem(DELETED_IDS_KEY);
    localStorage.removeItem(EDITED_IDS_KEY);
  } catch (err) {
    console.error('Error clearing deleted ids', err);
  }
  writeCollection(PLACES_STORAGE_KEY, INITIAL_PLACES);
  return INITIAL_PLACES;
}

/* ----------------------------- Events ----------------------------- */

export function getStoredEvents(): CityEvent[] {
  const stored = readCollection(EVENTS_STORAGE_KEY, INITIAL_EVENTS);
  const merged = mergeWithCatalogue(stored, INITIAL_EVENTS);
  if (merged.some((item, i) => item !== stored[i]) || merged.length !== stored.length) {
    writeCollection(EVENTS_STORAGE_KEY, merged);
  }
  return merged;
}

export function saveStoredEvents(events: CityEvent[]): void {
  writeCollection(EVENTS_STORAGE_KEY, events);
}

export function resetStoredEvents(): CityEvent[] {
  writeCollection(EVENTS_STORAGE_KEY, INITIAL_EVENTS);
  return INITIAL_EVENTS;
}

/* ---------------------------- Favorites --------------------------- */

export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading favorites', err);
    return [];
  }
}

export function toggleStoredFavorite(placeId: string): string[] {
  const current = getStoredFavorites();
  const updated = current.includes(placeId)
    ? current.filter((id) => id !== placeId)
    : [...current, placeId];

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving favorites', err);
  }
  return updated;
}

export function clearStoredFavorites(): void {
  try {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing favorites', err);
  }
}
