import type { Article, CityEvent } from '../types';
import { isPastEvent, sortEvents } from './events';

/**
 * "What else to look at" lists. A visitor arriving from search lands on one
 * page and, without these, has nowhere to go but back — so every detail page
 * offers the nearest few things of the same kind.
 */

/** Upcoming events other than the one being read. */
export function relatedEvents(
  events: CityEvent[],
  current?: CityEvent,
  limit = 3,
  now: Date = new Date(),
): CityEvent[] {
  const upcoming = events.filter((event) => event.slug !== current?.slug && !isPastEvent(event, now));

  // Same type first (a concert leads to concerts), then whatever is soonest.
  const sameType = current
    ? sortEvents(
        upcoming.filter((event) => event.event_type === current.event_type),
        now,
      )
    : [];
  const rest = sortEvents(
    upcoming.filter((event) => !sameType.includes(event)),
    now,
  );

  return [...sameType, ...rest].slice(0, limit);
}

/** Other guides, preferring the same category, newest first. */
export function relatedArticles(articles: Article[], current: Article, limit = 3): Article[] {
  const others = articles.filter((article) => article.slug !== current.slug);
  const byDate = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt);

  const sameCategory = others.filter((article) => article.category === current.category).sort(byDate);
  const rest = others.filter((article) => article.category !== current.category).sort(byDate);

  return [...sameCategory, ...rest].slice(0, limit);
}
