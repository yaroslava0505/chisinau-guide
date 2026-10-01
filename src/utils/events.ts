import type { CityEvent, EventWhen } from '../types';
import type { Dictionary } from '../i18n/dictionaries/uk';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Midnight of the given date, in local time. */
export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * For a weekly event, the next occurrence on or after `from`.
 * For a one-off event, its own start date.
 */
export function nextOccurrence(event: CityEvent, from: Date = new Date()): Date | null {
  const start = parseIsoDate(event.date_iso);
  if (!start) return null;
  if (!event.recurring_weekly) return start;

  const today = startOfDay(from);
  if (start >= today) return start;

  const daysSince = Math.floor((today.getTime() - start.getTime()) / DAY_MS);
  const offset = (7 - (daysSince % 7)) % 7;
  return new Date(today.getTime() + offset * DAY_MS);
}

/** Inclusive end date of an event (falls back to its start). */
function occurrenceEnd(event: CityEvent, occurrence: Date): Date {
  if (event.recurring_weekly) return occurrence;
  const end = event.end_date_iso ? parseIsoDate(event.end_date_iso) : null;
  return end && end > occurrence ? end : occurrence;
}

/** Saturday and Sunday of the current (or upcoming) weekend. */
export function weekendRange(from: Date = new Date()): { start: Date; end: Date } {
  const today = startOfDay(from);
  const weekday = (today.getDay() + 6) % 7; // Monday = 0
  const daysUntilSaturday = weekday <= 5 ? 5 - weekday : 0;
  const start = new Date(today.getTime() + daysUntilSaturday * DAY_MS);
  const end = weekday === 6 ? today : new Date(start.getTime() + DAY_MS);
  return { start, end };
}

export function matchesWhen(event: CityEvent, when: EventWhen, now: Date = new Date()): boolean {
  if (when === 'all') return true;

  const occurrence = nextOccurrence(event, now);
  if (!occurrence) return false;
  const end = occurrenceEnd(event, occurrence);

  const today = startOfDay(now);
  const covers = (day: Date) => occurrence <= day && day <= end;

  switch (when) {
    case 'today':
      return covers(today);
    case 'tomorrow':
      return covers(new Date(today.getTime() + DAY_MS));
    case 'weekend': {
      const { start, end: weekendEnd } = weekendRange(now);
      return occurrence <= weekendEnd && end >= start;
    }
    case 'week': {
      const weekEnd = new Date(today.getTime() + 7 * DAY_MS);
      return occurrence <= weekEnd && end >= today;
    }
    default:
      return true;
  }
}

/** Upcoming first; past one-off events sink to the bottom. */
export function sortEvents(events: CityEvent[], now: Date = new Date()): CityEvent[] {
  const today = startOfDay(now);
  return [...events].sort((a, b) => {
    const dateA = nextOccurrence(a, now);
    const dateB = nextOccurrence(b, now);
    if (!dateA) return 1;
    if (!dateB) return -1;
    const pastA = occurrenceEnd(a, dateA) < today ? 1 : 0;
    const pastB = occurrenceEnd(b, dateB) < today ? 1 : 0;
    if (pastA !== pastB) return pastA - pastB;
    return dateA.getTime() - dateB.getTime();
  });
}

export function isPastEvent(event: CityEvent, now: Date = new Date()): boolean {
  const occurrence = nextOccurrence(event, now);
  if (!occurrence) return false;
  return occurrenceEnd(event, occurrence) < startOfDay(now);
}

export const WHEN_VALUES: EventWhen[] = ['all', 'today', 'tomorrow', 'weekend', 'week'];

export const whenOptions = (t: Dictionary): { value: EventWhen; label: string }[] =>
  WHEN_VALUES.map((value) => ({ value, label: t.events.when[value] }));

/** `2026-09-12` → `12 вересня` / `12 сентября` / `12 septembrie`. */
export function formatDate(date: Date, t: Dictionary, withYear = false): string {
  const base = `${date.getDate()} ${t.events.months[date.getMonth()]}`;
  return withYear ? `${base} ${date.getFullYear()}` : base;
}

/** Display label for an event's next occurrence — "today", "tomorrow" or a date. */
export function occurrenceLabel(event: CityEvent, t: Dictionary, now: Date = new Date()): string {
  const occurrence = nextOccurrence(event, now);
  if (!occurrence) return event.date;

  const today = startOfDay(now);
  const diffDays = Math.round((occurrence.getTime() - today.getTime()) / DAY_MS);

  if (event.recurring_weekly) {
    return `${t.events.weekly[occurrence.getDay()]} · ${t.events.nextOn(formatDate(occurrence, t))}`;
  }
  if (diffDays === 0) return t.events.today;
  if (diffDays === 1) return t.events.tomorrow;
  return formatDate(occurrence, t, occurrence.getFullYear() !== now.getFullYear());
}
