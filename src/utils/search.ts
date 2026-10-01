import type { FilterState, Place, PlaceCategoryId } from '../types';

/**
 * Search is intentionally more than a name match: people type what they want
 * to do ("кава", "ноутбук", "cu copilul"), not what a venue is called. Each
 * rule below maps such an intent onto a category and/or a concrete predicate.
 *
 * Patterns are listed in all three site languages, so a Romanian query works
 * even while the interface is in Ukrainian and vice versa.
 */
interface IntentRule {
  /** Substrings that trigger the rule. Roots are kept short on purpose. */
  patterns: string[];
  category?: PlaceCategoryId;
  /** Extra condition a place must satisfy to count as a match for this intent. */
  matches?: (place: Place) => boolean;
  /** Filters applied when the user submits this query. */
  filters?: Partial<FilterState>;
}

const INTENT_RULES: IntentRule[] = [
  {
    patterns: ['кав', 'кофе', 'coffee', 'cafea', 'cafenea', 'espresso', 'еспресо', 'эспрессо', 'капучино', 'latte', 'лате'],
    category: 'cafes',
  },
  {
    patterns: ['тих', 'тиш', 'тишин', 'quiet', 'спокій', 'спокой', 'усаміт', 'уедин', 'liniș', 'linis', 'calm'],
    category: 'quiet_places',
  },
  {
    // A place is only offered for laptop work when its Wi-Fi is confirmed.
    patterns: ['ноутбук', 'laptop', 'робот', 'работ', 'work', 'коворк', 'cowork', 'фріланс', 'фрилан', 'freelance', 'lucr', 'muncă', 'munca', 'birou'],
    category: 'remote_work',
    matches: (place) => place.wifi === true,
    filters: { hasWifi: true },
  },
  {
    patterns: ['wifi', 'wi-fi', 'вайфай', 'вай-фай', 'інтернет', 'интернет', 'internet'],
    matches: (place) => place.wifi === true,
    filters: { hasWifi: true },
  },
  {
    patterns: ['терас', 'terrace', 'terasă', 'terasa', 'надвор', 'вулиц', 'на вулиці', 'на улице'],
    matches: (place) => place.terrace === true,
    filters: { hasTerrace: true },
  },
  {
    patterns: ['безкоштов', 'бесплат', 'free', 'даром', 'gratuit', 'gratis'],
    matches: (place) => place.free_entry === true,
    filters: { freeOnly: true },
  },
  {
    patterns: ['візок', 'коляск', 'wheelchair', 'accesibil', 'доступн'],
    matches: (place) => place.wheelchair === true,
    filters: { wheelchair: true },
  },
  {
    patterns: ['погуля', 'прогулян', 'гуля', 'парк', 'parc', 'walk', 'сквер', 'plimb'],
    category: 'walks',
  },
  {
    patterns: ['поїс', 'поес', 'їж', 'еда', 'обід', 'обед', 'вечер', 'ужин', 'ресторан', 'restaurant', 'food', 'голод', 'foame', 'mânca', 'manca', 'prânz', 'pranz'],
    category: 'food',
  },
  {
    patterns: ['читат', 'читан', 'книг', 'бібліот', 'библиот', 'read', 'citi', 'carte', 'bibliotec'],
    category: 'quiet_places',
    matches: (place) => place.venue_type === 'library',
  },
  {
    patterns: ['музе', 'muze', 'вистав', 'выстав', 'expozi', 'галере', 'galer', 'майстер', 'мастер', 'atelier', 'кіно', 'кино', 'cinema', 'театр', 'teatru', 'зайня', 'розваг', 'развлеч'],
    category: 'activities',
  },
  {
    patterns: ['побачен', 'свидан', 'романт', 'romantic', 'удвох', 'вдвоём', 'вдвоем', 'date', 'întâlnire', 'intalnire', 'în doi', 'in doi'],
    category: 'food',
  },
];

export interface QueryIntent {
  category?: PlaceCategoryId;
  filters: Partial<FilterState>;
  rules: IntentRule[];
}

const normalize = (value: string) => value.toLowerCase().trim();

/** Detects which intents a raw query expresses. */
export function analyzeQuery(rawQuery: string): QueryIntent {
  const query = normalize(rawQuery);
  const rules = query
    ? INTENT_RULES.filter((rule) => rule.patterns.some((pattern) => query.includes(pattern)))
    : [];

  const filters: Partial<FilterState> = {};
  rules.forEach((rule) => Object.assign(filters, rule.filters));

  return {
    category: rules.find((rule) => rule.category)?.category,
    filters,
    rules,
  };
}

/** Every text field a place can be found by. */
function haystack(place: Place): string {
  return [
    place.name,
    place.description,
    place.subcategory,
    place.district,
    place.address,
    place.atmosphere ?? '',
    place.venue_type ?? '',
    place.cuisine ?? '',
    place.activity_type ?? '',
    place.walk_type ?? '',
    ...(place.tags ?? []),
  ]
    .join(' ')
    .toLowerCase();
}

/**
 * Relevance score for one place against one query.
 * Returns 0 when the place does not match at all.
 */
export function scorePlace(place: Place, rawQuery: string, intent?: QueryIntent): number {
  const query = normalize(rawQuery);
  if (!query) return 1;

  const resolved = intent ?? analyzeQuery(query);
  const name = place.name.toLowerCase();

  let score = 0;

  if (name === query) score += 100;
  else if (name.startsWith(query)) score += 60;
  else if (name.includes(query)) score += 40;

  if (place.subcategory.toLowerCase().includes(query)) score += 25;
  if ((place.tags ?? []).some((tag) => tag.toLowerCase().includes(query))) score += 22;
  if (place.district.toLowerCase().includes(query)) score += 18;
  if (place.address.toLowerCase().includes(query)) score += 12;
  if (place.description.toLowerCase().includes(query)) score += 10;

  // Multi-word queries ("тихе кафе центр") match when every word is present.
  const words = query.split(/\s+/).filter((w) => w.length > 2);
  if (words.length > 1) {
    const text = haystack(place);
    if (words.every((word) => text.includes(word))) score += 20;
  }

  // A rule that states a requirement ("with Wi-Fi") filters rather than
  // boosts: a place whose Wi-Fi nobody confirmed must not surface just because
  // the words matched its description.
  const failsRequirement = resolved.rules.some((rule) => rule.matches && !rule.matches(place));
  if (failsRequirement) return 0;

  resolved.rules.forEach((rule) => {
    if (rule.category && place.category === rule.category) score += 30;
    if (rule.matches?.(place)) score += 26;
  });

  return score;
}

export interface SearchResult {
  places: Place[];
  intent: QueryIntent;
}

/** Filters and ranks places for a free-text query. */
export function searchPlaces(places: Place[], rawQuery: string): SearchResult {
  const query = normalize(rawQuery);
  const intent = analyzeQuery(query);

  if (!query) return { places, intent };

  const scored = places
    .map((place) => ({ place, score: scorePlace(place, query, intent) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return { places: scored.map((entry) => entry.place), intent };
}

/** True when the query matches this place at all — used by the list filter. */
export function matchesQuery(place: Place, rawQuery: string, intent?: QueryIntent): boolean {
  return scorePlace(place, rawQuery, intent) > 0;
}
