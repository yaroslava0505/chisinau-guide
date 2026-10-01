import type { CityEvent, Place } from '../types';
import { DISTRICT_IDS } from '../data/chisinauPlaces';

/**
 * Turns the edited catalogue back into `src/data/chisinauPlaces.ts`.
 *
 * The admin panel writes to localStorage, which lives only in the editor's own
 * browser — visitors never see it. Publishing therefore means putting the data
 * back into the source file and rebuilding, and this produces exactly that file.
 *
 * The records are emitted with `JSON.stringify`: JSON is valid TypeScript
 * object-literal syntax, it escapes every string correctly, and it drops
 * `undefined` fields — which is precisely the meaning the catalogue needs,
 * since an absent field means "nobody checked" rather than "false".
 */
export function buildCatalogueFile(places: Place[], events: CityEvent[]): string {
  const stamp = new Date().toISOString().slice(0, 10);

  return `import { Place, CityEvent, District } from '../types';

/**
 * The catalogue.
 *
 * Exported from the admin panel on ${stamp}.
 * Fields that are absent from a record are unknown, not false: the interface
 * hides them rather than presenting a guess as a fact.
 */
export const INITIAL_PLACES: Place[] = ${JSON.stringify(places, null, 2)};

export const INITIAL_EVENTS: CityEvent[] = ${JSON.stringify(events, null, 2)};

/**
 * District ids double as the stored value on every Place. Display names for
 * each language live in the dictionaries (\`t.districts\`).
 */
export const DISTRICT_IDS: District[] = ${JSON.stringify(DISTRICT_IDS, null, 2)};
`;
}

/** Offers the generated file to the browser as a download. */
export function downloadCatalogue(places: Place[], events: CityEvent[]): void {
  const blob = new Blob([buildCatalogueFile(places, events)], {
    type: 'text/plain;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'chisinauPlaces.ts';
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
