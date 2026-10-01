import type { Locale } from './i18n/types';

/** Fields of a Place that are worth translating. */
export interface PlaceTranslation {
  name?: string;
  description?: string;
  subcategory?: string;
  tags?: string[];
}

/** Fields of a CityEvent that are worth translating. */
export interface EventTranslation {
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  date?: string;
  tags?: string[];
}

/**
 * Translations live on the record itself so they survive localStorage and can
 * be edited in the admin panel. The default locale (uk) is stored in the
 * top-level fields; anything missing here falls back to it.
 */
export type PlaceI18n = Partial<Record<Exclude<Locale, 'uk'>, PlaceTranslation>>;
export type EventI18n = Partial<Record<Exclude<Locale, 'uk'>, EventTranslation>>;

/** A comment a visitor left on a place. */
export interface PlaceComment {
  id: string;
  place_id: string;
  /** Display name; empty means the visitor stayed anonymous. */
  author: string;
  text: string;
  /** ISO timestamp of when it was written. */
  created_at: string;
}

/** Fields that can be marked as verified on a Place. */
export type ConfirmedField =
  | 'name'
  | 'address'
  | 'coordinates'
  | 'opening_hours'
  | 'website'
  | 'phone'
  | 'cuisine'
  | 'wifi'
  | 'terrace'
  | 'air_conditioning'
  | 'wheelchair'
  | 'pet_friendly'
  | 'free_entry'
  | 'photos'
  | 'wifi_rating'
  | 'quiet_rating'
  | 'outlet_rating'
  | 'comfort_rating'
  | 'work_rating'
  | 'calls_rating';

export type CategoryId =
  | 'all'
  | 'remote_work'
  | 'quiet_places'
  | 'cafes'
  | 'food'
  | 'walks'
  | 'activities'
  | 'events';

/** Categories that actually hold Place records (events live in their own collection). */
export type PlaceCategoryId = Exclude<CategoryId, 'all' | 'events'>;

export type District =
  | 'Центр'
  | 'Ришканівка'
  | 'Ботаніка'
  | 'Буюкань'
  | 'Чокана'
  | 'Телецентр';

export type Atmosphere = 'creative' | 'aesthetic' | 'cozy' | 'vibrant' | 'minimalist';

export type VenueType =
  | 'cafe'
  | 'coworking'
  | 'park'
  | 'library'
  | 'nature'
  | 'restaurant'
  | 'bistro'
  | 'bakery'
  | 'culture';

/** Extra structured data for walking routes (category `walks`). */
export interface WalkRoute {
  duration_min: number;
  distance_km: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  start: string;
  finish: string;
  highlights: string[];
  cafes_on_route: string[];
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: PlaceCategoryId;
  subcategory: string;
  district: District;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  instagram: string;
  opening_hours: string;
  price_level: 1 | 2 | 3; // 1 = $, 2 = $$, 3 = $$$
  photos: string[];

  /**
   * Characteristic ratings, 1 to 5.
   *
   * Optional on purpose: a rating may only be present when somebody actually
   * measured it on the spot. An absent value means "not checked yet" and the
   * interface says so instead of guessing.
   */
  wifi_rating?: number;
  quiet_rating?: number;
  outlet_rating?: number;
  comfort_rating?: number;
  work_rating?: number;
  calls_rating?: number;

  /**
   * Amenities. `true` means confirmed present, `false` means confirmed absent,
   * and `undefined` means nobody has checked — the three states are different
   * and the interface must not collapse the last two into "no".
   */
  kids_friendly?: boolean;
  pet_friendly?: boolean;
  terrace?: boolean;
  parking?: boolean;
  air_conditioning?: boolean;
  wifi?: boolean;
  wheelchair?: boolean;
  free_entry?: boolean;
  low_crowd?: boolean;
  good_for_reading?: boolean;
  long_stay_ok?: boolean;
  solo_friendly?: boolean;
  breakfast?: boolean;
  atmosphere?: Atmosphere;
  venue_type?: VenueType;

  // Scenario helpers ("удвох", "з дітьми", "великий стіл", "коворкінг")
  good_for_date?: boolean;
  big_table?: boolean;

  /** Kitchen / cuisine key for the `food` category, e.g. 'pizza' | 'sushi'. */
  cuisine?: string;
  /** Activity type key for the `activities` category, e.g. 'museum' | 'cinema'. */
  activity_type?: string;
  /** Walk type key for the `walks` category, e.g. 'park' | 'route' | 'sunset'. */
  walk_type?: string;
  /** Structured route info, only meaningful when `walk_type === 'route'`. */
  route?: WalkRoute;

  /** Free-form search tags (Ukrainian + latin), improves discoverability. */
  tags?: string[];

  /** Russian and Romanian versions of the text fields. */
  i18n?: PlaceI18n;

  /**
   * Where the address, coordinates and opening hours came from, e.g.
   * `OpenStreetMap`. Required attribution for ODbL data, and it tells a reader
   * which records are backed by a real source rather than invented for the demo.
   */
  source?: { name: string; url?: string };

  /**
   * Which fields of this record have actually been verified, and when.
   *
   * Anything not listed here is unknown rather than false: the interface hides
   * it instead of presenting a guess as a fact.
   */
  confirmed?: {
    fields: ConfirmedField[];
    checked_at?: string;
  };

  is_demo: boolean;
  is_featured?: boolean;
  is_popular?: boolean;
  created_at?: string;
}

export interface CityEvent {
  id: string;
  title: string;
  slug: string;
  /** Human readable date shown in the UI, e.g. '12 вересня 2026'. */
  date: string;
  /** Machine readable start date `YYYY-MM-DD` — required for the today/tomorrow/weekend filters. */
  date_iso: string;
  /** Machine readable end date for multi-day events. Falls back to `date_iso`. */
  end_date_iso?: string;
  /** Set for events that repeat every week on the weekday of `date_iso`. */
  recurring_weekly?: boolean;
  time: string;
  location_name: string;
  address: string;
  /** Human readable category label. */
  category: string;
  /** Machine readable event type used by the type filter. */
  event_type: EventType;
  price: string;
  free_entry?: boolean;
  description: string;
  image: string;
  tags: string[];
  /** Russian and Romanian versions of the text fields. */
  i18n?: EventI18n;
  is_demo: boolean;
}

export type EventType =
  | 'concert'
  | 'festival'
  | 'exhibition'
  | 'lecture'
  | 'workshop'
  | 'kids'
  | 'sport'
  | 'cinema';

export type EventWhen = 'all' | 'today' | 'tomorrow' | 'weekend' | 'week';

/** One of the 8 quick user intents on the home page. */
export type ScenarioId =
  | 'work'
  | 'relax'
  | 'coffee'
  | 'eat'
  | 'walk'
  | 'date'
  | 'fun'
  | 'events';

/** Only filters that a confirmed field can answer. */
export interface FilterState {
  searchQuery: string;
  district: District | 'all';
  priceLevel: number | 'all';

  /** Amenity filters — each requires a confirmed `true` on the record. */
  hasWifi: boolean;
  hasTerrace: boolean;
  hasAirConditioning: boolean;
  wheelchair: boolean;
  freeOnly: boolean;
  openNowOnly: boolean;

  /** Structural filters, driven by OpenStreetMap classification. */
  workVenue: 'all' | 'coworking' | 'cafe';
  quietType: 'all' | 'park' | 'cafe' | 'library' | 'nature';
  cafeType: 'all' | 'specialty' | 'bakery' | 'bistro';
  cuisine: string;
  walkType: string;
  activityType: string;
}
