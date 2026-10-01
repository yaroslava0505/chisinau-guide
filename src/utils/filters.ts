import type { CategoryId, FilterState, Place } from '../types';
import { isOpenNow } from './openingHours';
import { isConfirmed } from './placeMetrics';
import { analyzeQuery, matchesQuery, scorePlace } from './search';

export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  district: 'all',
  priceLevel: 'all',

  hasWifi: false,
  hasAirConditioning: false,
  hasTerrace: false,
  wheelchair: false,
  openNowOnly: false,
  workVenue: 'all',

  quietType: 'all',
  freeOnly: false,

  cafeType: 'all',

  cuisine: 'all',
  walkType: 'all',
  activityType: 'all',
};

/**
 * Cafe subcategories are partly structural (`venue_type`) and partly about
 * what the place is good for. Only the structural half survives the data
 * cleanup — the rest depended on ratings nobody measured.
 */
function matchesCafeType(place: Place, type: FilterState['cafeType']): boolean {
  switch (type) {
    case 'all': return true;
    case 'specialty': return place.venue_type === 'cafe';
    case 'bakery': return place.venue_type === 'bakery';
    case 'bistro': return place.venue_type === 'bistro';
    default: return true;
  }
}

export interface FilterContext {
  /** Injected so the "open now" filter is testable and stable within a render. */
  now?: Date;
}

/**
 * True when a place satisfies every active filter.
 *
 * Amenity filters require a *confirmed* `true`: a place whose Wi-Fi nobody has
 * checked is not offered as a Wi-Fi place, because that would be a guess.
 */
export function placeMatchesFilters(
  place: Place,
  activeCategory: CategoryId,
  filters: FilterState,
  context: FilterContext = {},
): boolean {
  if (activeCategory !== 'all' && activeCategory !== 'events' && place.category !== activeCategory) {
    return false;
  }

  if (filters.district !== 'all' && place.district !== filters.district) return false;
  if (filters.priceLevel !== 'all' && place.price_level !== filters.priceLevel) return false;
  if (filters.openNowOnly && !isOpenNow(place.opening_hours, context.now)) return false;

  if (filters.hasWifi && !(place.wifi && isConfirmed(place, 'wifi'))) return false;
  if (filters.hasTerrace && !(place.terrace && isConfirmed(place, 'terrace'))) return false;
  if (filters.hasAirConditioning && !(place.air_conditioning && isConfirmed(place, 'air_conditioning'))) return false;
  if (filters.wheelchair && !(place.wheelchair && isConfirmed(place, 'wheelchair'))) return false;
  if (filters.freeOnly && !(place.free_entry && isConfirmed(place, 'free_entry'))) return false;

  if (activeCategory === 'remote_work' && filters.workVenue !== 'all') {
    if (place.venue_type !== filters.workVenue) return false;
  }
  if (activeCategory === 'quiet_places' && filters.quietType !== 'all') {
    if (place.venue_type !== filters.quietType) return false;
  }
  if (activeCategory === 'cafes' && !matchesCafeType(place, filters.cafeType)) return false;
  if (activeCategory === 'food' && filters.cuisine !== 'all' && place.cuisine !== filters.cuisine) return false;
  if (activeCategory === 'walks' && filters.walkType !== 'all' && place.walk_type !== filters.walkType) return false;
  if (activeCategory === 'activities' && filters.activityType !== 'all' && place.activity_type !== filters.activityType) return false;

  return true;
}

/**
 * Applies filters and, when a search query is present, ranks the result by
 * relevance instead of catalogue order.
 */
export function filterPlaces(
  places: Place[],
  activeCategory: CategoryId,
  filters: FilterState,
  context: FilterContext = {},
): Place[] {
  const query = filters.searchQuery.trim();
  const intent = query ? analyzeQuery(query) : undefined;

  const matched = places.filter((place) => {
    if (!placeMatchesFilters(place, activeCategory, filters, context)) return false;
    if (query && !matchesQuery(place, query, intent)) return false;
    return true;
  });

  if (!query) return matched;

  return matched
    .map((place) => ({ place, score: scorePlace(place, query, intent) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.place);
}

/** Number of filters the user has changed away from the default. */
export function countActiveFilters(filters: FilterState): number {
  return (Object.keys(INITIAL_FILTERS) as (keyof FilterState)[]).reduce((count, key) => {
    if (key === 'searchQuery') return count;
    return filters[key] !== INITIAL_FILTERS[key] ? count + 1 : count;
  }, 0);
}
