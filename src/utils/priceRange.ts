import type { Dictionary } from '../i18n/dictionaries/uk';
import type { Place } from '../types';

/** "страви 90–320 MDL", or null when the venue publishes no prices. */
export function formatPriceRange(place: Place, t: Dictionary): string | null {
  const range = place.price_range;
  if (!range) return null;
  const kind = t.detail.priceKinds[range.kind];
  const amount = range.from === range.to ? `${range.from}` : `${range.from}–${range.to}`;
  return `${kind} ${amount} MDL`;
}
