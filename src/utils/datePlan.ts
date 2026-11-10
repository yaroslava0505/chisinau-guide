import type { CityEvent, Place } from '../types';
import { isPastEvent, sortEvents } from './events';

/**
 * The "date" page is an editorial selection, so the rules it selects by are
 * stated on the page itself. Nothing here asserts a new fact about a place —
 * every rule reads fields that were confirmed from the venue's own site.
 */

/** Restaurants and cafés that take a booking, have a terrace or live music. */
export function dateFood(places: Place[], limit = 6): Place[] {
  const signals = (place: Place) =>
    Number(place.reservation === true) +
    Number(place.live_music === true) +
    Number(place.terrace === true) +
    Number(place.price_level >= 3) +
    Number(place.photos.length > 0);

  return places
    .filter(
      (place) =>
        (place.category === 'food' || place.category === 'cafes') &&
        place.price_level >= 2 &&
        (place.reservation === true || place.live_music === true || place.terrace === true),
    )
    .sort((a, b) => signals(b) - signals(a) || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/** Parks and viewpoints — the walk part of an evening. */
export function dateWalks(places: Place[], limit = 4): Place[] {
  const preferred = ['sunset', 'scenic', 'park', 'nature'];
  return places
    .filter((place) => place.walk_type && preferred.includes(place.walk_type))
    .sort(
      (a, b) =>
        preferred.indexOf(a.walk_type ?? '') - preferred.indexOf(b.walk_type ?? '') ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}

/** Workshops, museums and exhibitions — something to do together. */
export function dateActivities(places: Place[], limit = 4): Place[] {
  const preferred = ['workshop', 'creative', 'exhibition', 'museum', 'cinema'];
  return places
    .filter((place) => place.activity_type && preferred.includes(place.activity_type))
    .sort(
      (a, b) =>
        preferred.indexOf(a.activity_type ?? '') - preferred.indexOf(b.activity_type ?? '') ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}

/** Upcoming evening events: concerts, theatre, cinema, exhibitions. */
export function dateEvents(events: CityEvent[], limit = 4, now: Date = new Date()): CityEvent[] {
  const types = ['concert', 'theatre', 'cinema', 'exhibition', 'festival'];
  return sortEvents(
    events.filter((event) => types.includes(event.event_type) && !isPastEvent(event, now)),
    now,
  ).slice(0, limit);
}
