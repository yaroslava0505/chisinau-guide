import type {
  Atmosphere,
  CategoryId,
  EventType,
  FilterState,
  PlaceCategoryId,
  ScenarioId,
} from '../types';

/**
 * This module holds only the *structure* of the taxonomy — ids, URL slugs,
 * icons and colours. Every human-readable label lives in `src/i18n`, so a new
 * language never requires touching this file.
 */

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export interface CategoryMeta {
  id: Exclude<CategoryId, 'all'>;
  /** URL segment, e.g. `remote-work` for `/remote-work`. */
  slug: string;
  icon: string;
  badgeColor: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  { id: 'remote_work', slug: 'remote-work', icon: 'Laptop', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'quiet_places', slug: 'quiet-places', icon: 'Feather', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'cafes', slug: 'cafes', icon: 'Coffee', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'food', slug: 'food', icon: 'Utensils', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'walks', slug: 'walks', icon: 'Footprints', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'activities', slug: 'activities', icon: 'Compass', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'events', slug: 'events', icon: 'Calendar', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export const categoryBySlug = (slug: string): CategoryMeta | undefined =>
  CATEGORY_META.find((category) => category.slug === slug);

export const categoryById = (id: CategoryId): CategoryMeta | undefined =>
  CATEGORY_META.find((category) => category.id === id);

export const categorySlug = (id: CategoryId): string => categoryById(id)?.slug ?? '';

/* ------------------------------------------------------------------ */
/* Scenarios — the 8 quick intents on the home page                    */
/* ------------------------------------------------------------------ */

export interface Scenario {
  id: ScenarioId;
  emoji: string;
  /** Category the scenario lands on. */
  category: PlaceCategoryId;
  /** Filters pre-applied when the scenario is picked. */
  filters: Partial<FilterState>;
}

/**
 * The eight intents on the home page.
 *
 * Each one leans on data the catalogue can actually stand behind: a category
 * assignment from OpenStreetMap, or a confirmed amenity. None filters by a
 * rating, because no rating has been measured.
 */
export const SCENARIOS: Scenario[] = [
  { id: 'work', emoji: '💻', category: 'remote_work', filters: { hasWifi: true } },
  { id: 'relax', emoji: '🌿', category: 'quiet_places', filters: {} },
  { id: 'coffee', emoji: '☕', category: 'cafes', filters: {} },
  { id: 'eat', emoji: '🍽', category: 'food', filters: {} },
  { id: 'walk', emoji: '🚶', category: 'walks', filters: {} },
  { id: 'date', emoji: '❤️', category: 'food', filters: {} },
  { id: 'fun', emoji: '🎨', category: 'activities', filters: {} },
  { id: 'events', emoji: '📅', category: 'activities', filters: {} },
];


/* ------------------------------------------------------------------ */
/* Option value lists (labels come from the dictionaries)              */
/* ------------------------------------------------------------------ */

export const CAFE_TYPE_VALUES = [
  'specialty', 'bakery', 'bistro', 'brunch', 'dessert', 'work', 'date', 'cozy',
] as const;

export const ATMOSPHERE_VALUES: Atmosphere[] = [
  'creative', 'aesthetic', 'cozy', 'vibrant', 'minimalist',
];

export const CUISINE_VALUES = [
  'pizza', 'burgers', 'sushi', 'italian', 'meat', 'moldovan',
  'vegetarian', 'bakery', 'desserts', 'street_food', 'healthy',
] as const;

export const WALK_TYPE_VALUES = [
  'park', 'square', 'route', 'nature', 'scenic', 'sunset', 'photo',
] as const;

export const ACTIVITY_TYPE_VALUES = [
  'museum', 'exhibition', 'cinema', 'theatre', 'concert',
  'workshop', 'sport', 'creative', 'wellness', 'entertainment',
] as const;

export const QUIET_TYPE_VALUES = ['park', 'cafe', 'library', 'nature'] as const;

export const EVENT_TYPE_VALUES: EventType[] = [
  'concert', 'festival', 'exhibition', 'lecture', 'workshop', 'kids', 'sport', 'cinema',
];

export const PRICE_LEVEL_VALUES = [1, 2, 3] as const;

export const VENUE_TYPE_VALUES = [
  'cafe', 'coworking', 'park', 'library', 'nature', 'restaurant', 'bistro', 'bakery', 'culture',
] as const;
