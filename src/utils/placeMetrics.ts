import {
  Accessibility,
  Armchair,
  Clock,
  Coffee,
  Dog,
  Footprints,
  Route,
  Sparkles,
  Ticket,
  Trees,
  Users,
  Utensils,
  Wifi,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import type { ConfirmedField, Place, PlaceCategoryId } from '../types';
import type { Dictionary } from '../i18n/dictionaries/uk';
import { activityTypeLabel, cuisineLabel, walkTypeLabel } from '../i18n/labels';

/**
 * What the interface may say about a place.
 *
 * The rule throughout this module: only confirmed facts are rendered. An
 * amenity that nobody has checked is absent from the output entirely — it is
 * never shown as "no", because "we did not check" and "it is not there" are
 * different statements and only one of them is true.
 */

export const isConfirmed = (place: Place, field: ConfirmedField): boolean =>
  place.confirmed?.fields.includes(field) ?? false;

/* ------------------------------------------------------------------ */
/* Ratings                                                             */
/* ------------------------------------------------------------------ */

export type RatingId = 'wifi' | 'outlets' | 'quiet' | 'comfort' | 'work' | 'calls';

export interface RatingItem {
  id: RatingId;
  label: string;
  icon: LucideIcon;
  value: number;
  color: string;
}

const RATING_FIELD: Record<RatingId, ConfirmedField> = {
  wifi: 'wifi_rating',
  outlets: 'outlet_rating',
  quiet: 'quiet_rating',
  comfort: 'comfort_rating',
  work: 'work_rating',
  calls: 'calls_rating',
};

const RATING_ICONS: Record<RatingId, { icon: LucideIcon; color: string }> = {
  wifi: { icon: Wifi, color: 'text-emerald-600' },
  outlets: { icon: Sparkles, color: 'text-amber-500' },
  quiet: { icon: Armchair, color: 'text-sky-600' },
  comfort: { icon: Armchair, color: 'text-rose-500' },
  work: { icon: Wifi, color: 'text-indigo-600' },
  calls: { icon: Wifi, color: 'text-violet-600' },
};

const ratingValue = (place: Place, id: RatingId): number | undefined => {
  switch (id) {
    case 'wifi': return place.wifi_rating;
    case 'outlets': return place.outlet_rating;
    case 'quiet': return place.quiet_rating;
    case 'comfort': return place.comfort_rating;
    case 'work': return place.work_rating;
    case 'calls': return place.calls_rating;
    default: return undefined;
  }
};

const RATINGS_BY_CATEGORY: Record<PlaceCategoryId, RatingId[]> = {
  remote_work: ['work', 'wifi', 'outlets', 'quiet', 'comfort', 'calls'],
  quiet_places: ['quiet', 'comfort'],
  cafes: ['comfort', 'quiet', 'wifi', 'outlets'],
  food: ['comfort', 'quiet'],
  walks: ['quiet', 'comfort'],
  activities: ['comfort', 'quiet'],
};

/**
 * Ratings worth showing — only those actually measured for this place.
 * Returns an empty list while nobody has rated it, and the caller then hides
 * the whole block instead of drawing empty bars.
 */
export function getRatingItems(place: Place, t: Dictionary): RatingItem[] {
  return RATINGS_BY_CATEGORY[place.category]
    .map((id) => ({ id, value: ratingValue(place, id) }))
    .filter((r): r is { id: RatingId; value: number } =>
      r.value !== undefined && isConfirmed(place, RATING_FIELD[r.id]))
    .map(({ id, value }) => ({ id, label: t.metrics[id], ...RATING_ICONS[id], value }));
}

/* ------------------------------------------------------------------ */
/* Card chips — confirmed facts only                                   */
/* ------------------------------------------------------------------ */

export interface CardChip {
  id: string;
  icon: LucideIcon;
  label: string;
}

/**
 * Up to three facts that help someone judge a place at a glance.
 * Built from the catalogue's verified fields, never from guesses.
 */
export function getCardChips(place: Place, t: Dictionary): CardChip[] {
  const chips: CardChip[] = [];
  const c = t.metrics.chips;

  if (place.wifi && isConfirmed(place, 'wifi')) {
    chips.push({ id: 'wifi', icon: Wifi, label: c.wifi });
  }
  if (place.terrace && isConfirmed(place, 'terrace')) {
    chips.push({ id: 'terrace', icon: Trees, label: c.terrace });
  }

  switch (place.category) {
    case 'food': {
      const cuisine = cuisineLabel(t, place.cuisine);
      if (cuisine) chips.push({ id: 'cuisine', icon: Utensils, label: cuisine });
      break;
    }
    case 'walks': {
      if (place.route) {
        chips.push({ id: 'duration', icon: Clock, label: c.minutes(place.route.duration_min) });
        chips.push({ id: 'distance', icon: Route, label: c.kilometres(place.route.distance_km) });
      } else {
        const type = walkTypeLabel(t, place.walk_type);
        if (type) chips.push({ id: 'walk', icon: Footprints, label: type });
      }
      break;
    }
    case 'activities': {
      const type = activityTypeLabel(t, place.activity_type);
      if (type) chips.push({ id: 'activity', icon: Sparkles, label: type });
      break;
    }
    case 'cafes':
      if (place.breakfast) chips.push({ id: 'breakfast', icon: Coffee, label: c.breakfast });
      break;
    default:
      break;
  }

  if (place.free_entry && isConfirmed(place, 'free_entry')) {
    chips.push({ id: 'free', icon: Ticket, label: c.free });
  }
  if (place.air_conditioning && isConfirmed(place, 'air_conditioning')) {
    chips.push({ id: 'ac', icon: Wind, label: c.airConditioning });
  }

  return chips.slice(0, 3);
}

/* ------------------------------------------------------------------ */
/* Confirmed amenities, for the detail page                            */
/* ------------------------------------------------------------------ */

export interface Amenity {
  id: string;
  icon: LucideIcon;
  label: string;
}

const AMENITIES: { id: string; field: ConfirmedField; icon: LucideIcon; key: keyof Dictionary['amenities']; read: (p: Place) => boolean | undefined }[] = [
  { id: 'wifi', field: 'wifi', icon: Wifi, key: 'wifi', read: (p) => p.wifi },
  { id: 'terrace', field: 'terrace', icon: Trees, key: 'terrace', read: (p) => p.terrace },
  { id: 'ac', field: 'air_conditioning', icon: Wind, key: 'airConditioning', read: (p) => p.air_conditioning },
  { id: 'wheelchair', field: 'wheelchair', icon: Accessibility, key: 'wheelchair', read: (p) => p.wheelchair },
  { id: 'pet', field: 'pet_friendly', icon: Dog, key: 'pet', read: (p) => p.pet_friendly },
  { id: 'free', field: 'free_entry', icon: Ticket, key: 'freeEntry', read: (p) => p.free_entry },
];

/** Amenities confirmed to be present. */
export const getConfirmedAmenities = (place: Place, t: Dictionary): Amenity[] =>
  AMENITIES.filter((a) => a.read(place) === true && isConfirmed(place, a.field))
    .map((a) => ({ id: a.id, icon: a.icon, label: t.amenities[a.key] }));

/** Amenities confirmed to be absent — worth stating, e.g. "no terrace". */
export const getAbsentAmenities = (place: Place, t: Dictionary): Amenity[] =>
  AMENITIES.filter((a) => a.read(place) === false && isConfirmed(place, a.field))
    .map((a) => ({ id: a.id, icon: a.icon, label: t.amenities[a.key] }));

/* ------------------------------------------------------------------ */
/* "Чому ми рекомендуємо це місце"                                     */
/* ------------------------------------------------------------------ */

/**
 * Reasons to go, derived from verified data and — when the visitor arrived
 * through a scenario — phrased for that intent. Returns nothing when the
 * catalogue knows nothing worth saying, and the block is then hidden.
 */
export function getWhyHere(place: Place, t: Dictionary, limit = 4): Amenity[] {
  const reasons: Amenity[] = [];

  if (place.wifi && isConfirmed(place, 'wifi')) {
    reasons.push({ id: 'wifi', icon: Wifi, label: t.reasons.wifi });
  }
  if (place.terrace && isConfirmed(place, 'terrace')) {
    reasons.push({ id: 'terrace', icon: Trees, label: t.reasons.terrace });
  }
  if (place.air_conditioning && isConfirmed(place, 'air_conditioning')) {
    reasons.push({ id: 'ac', icon: Wind, label: t.reasons.airConditioning });
  }
  if (place.wheelchair && isConfirmed(place, 'wheelchair')) {
    reasons.push({ id: 'wheelchair', icon: Accessibility, label: t.reasons.wheelchair });
  }
  if (place.free_entry && isConfirmed(place, 'free_entry')) {
    reasons.push({ id: 'free', icon: Ticket, label: t.reasons.free });
  }
  if (place.route) {
    reasons.push({ id: 'route', icon: Route, label: t.reasons.route(place.route.duration_min) });
  }
  if (place.opening_hours && isConfirmed(place, 'opening_hours')) {
    reasons.push({ id: 'hours', icon: Clock, label: t.reasons.knownHours });
  }

  return reasons.slice(0, limit);
}

/** How complete a record is — drives the admin "what is missing" view. */
export function completeness(place: Place): { known: number; total: number } {
  const checks = [
    place.confirmed?.fields.includes('address'),
    place.confirmed?.fields.includes('opening_hours'),
    place.confirmed?.fields.includes('website'),
    Boolean(place.phone),
    place.wifi !== undefined,
    place.terrace !== undefined,
    place.air_conditioning !== undefined,
    place.wheelchair !== undefined,
    place.wifi_rating !== undefined,
    place.photos.some((p) => !p.includes('unsplash')),
  ];
  return { known: checks.filter(Boolean).length, total: checks.length };
}
