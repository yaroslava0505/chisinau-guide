import type { Atmosphere, CategoryId, District, EventType } from '../types';
import {
  ACTIVITY_TYPE_VALUES,
  ATMOSPHERE_VALUES,
  CAFE_TYPE_VALUES,
  CUISINE_VALUES,
  EVENT_TYPE_VALUES,
  PRICE_LEVEL_VALUES,
  QUIET_TYPE_VALUES,
  WALK_TYPE_VALUES,
} from '../data/taxonomy';
import type { Dictionary } from './dictionaries/uk';

export interface Option {
  value: string | number;
  label: string;
}

const toOptions = <T extends readonly (string | number)[]>(
  values: T,
  labels: Record<string, string>,
): Option[] => values.map((value) => ({ value, label: labels[String(value)] ?? String(value) }));

export const cafeTypeOptions = (t: Dictionary) => toOptions(CAFE_TYPE_VALUES, t.options.cafeType);
export const atmosphereOptions = (t: Dictionary) => toOptions(ATMOSPHERE_VALUES, t.options.atmosphere);
export const cuisineOptions = (t: Dictionary) => toOptions(CUISINE_VALUES, t.options.cuisine);
export const walkTypeOptions = (t: Dictionary) => toOptions(WALK_TYPE_VALUES, t.options.walkType);
export const activityTypeOptions = (t: Dictionary) => toOptions(ACTIVITY_TYPE_VALUES, t.options.activityType);
export const quietTypeOptions = (t: Dictionary) => toOptions(QUIET_TYPE_VALUES, t.options.quietType);
export const eventTypeOptions = (t: Dictionary) => toOptions(EVENT_TYPE_VALUES, t.options.eventType);
export const priceLevelOptions = (t: Dictionary) =>
  toOptions(PRICE_LEVEL_VALUES, t.options.priceLevel as unknown as Record<string, string>);

export const districtLabel = (t: Dictionary, district: District): string =>
  t.districts[district] ?? district;

export const districtShortLabel = (t: Dictionary, district: District): string =>
  t.districtsShort[district] ?? district;

export const atmosphereLabel = (t: Dictionary, atmosphere: Atmosphere): string =>
  t.options.atmosphere[atmosphere];

export const difficultyLabel = (t: Dictionary, difficulty: string): string =>
  (t.options.difficulty as Record<string, string>)[difficulty] ?? difficulty;

export const cuisineLabel = (t: Dictionary, value?: string): string | undefined =>
  value ? (t.options.cuisine as Record<string, string>)[value] : undefined;

export const walkTypeLabel = (t: Dictionary, value?: string): string | undefined =>
  value ? (t.options.walkType as Record<string, string>)[value] : undefined;

export const activityTypeLabel = (t: Dictionary, value?: string): string | undefined =>
  value ? (t.options.activityType as Record<string, string>)[value] : undefined;

export const eventTypeLabel = (t: Dictionary, value: EventType): string =>
  t.options.eventType[value];

/** Category copy (name, H1, subtitle, SEO) for the active language. */
export const categoryCopy = (t: Dictionary, id: CategoryId) =>
  id === 'all' ? undefined : t.categories[id as keyof Dictionary['categories']];

export const categoryName = (t: Dictionary, id: CategoryId): string =>
  categoryCopy(t, id)?.name ?? t.nav.all;
