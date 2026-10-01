/**
 * Opening-hours helpers.
 *
 * The catalogue stores hours as a human string, e.g. `08:00 – 22:00`,
 * `09:00 – 19:00 (Пн-Сб)` or `Цілодобово 24/7`. These helpers read just
 * enough of that string to answer "is it open right now?" without
 * inventing information that is not in the data.
 */

export type OpenState = 'open' | 'closed' | 'unknown';

const TIME_RANGE = /(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})/;
const ALWAYS_OPEN = /цілодобово|24\/7/i;

/**
 * Weekday abbreviations, Monday-indexed. Ukrainian is what the catalogue uses;
 * the English forms let an OpenStreetMap string (`Mo-Fr 09:00-20:00`) be pasted
 * into the admin panel without silently losing the day restriction.
 */
const WEEKDAYS: string[][] = [
  ['пн', 'mo'],
  ['вт', 'tu'],
  ['ср', 'we'],
  ['чт', 'th'],
  ['пт', 'fr'],
  ['сб', 'sa'],
  ['нд', 'su'],
];

const DAY_TOKEN = 'пн|вт|ср|чт|пт|сб|нд|mo|tu|we|th|fr|sa|su';

interface ParsedHours {
  alwaysOpen: boolean;
  openMinutes?: number;
  closeMinutes?: number;
  /** Weekday indexes (0 = Monday) the venue is closed on, when stated. */
  closedDays: number[];
}

function weekdayIndex(token: string): number {
  const key = token.trim().toLowerCase().slice(0, 2);
  return WEEKDAYS.findIndex((forms) => forms.includes(key));
}

/** Reads `(Вихідний: Пт)`, `(Пн-Сб)` and `Mo-Fr` style annotations. */
function parseDayAnnotation(source: string): number[] {
  const closed: number[] = [];

  // `\w` does not cover Cyrillic in JS, so match up to the colon explicitly.
  const dayOff = source.match(/вихідн[^:)]*:\s*([^)]+)/i);
  if (dayOff) {
    dayOff[1]
      .split(/[,/]/)
      .map(weekdayIndex)
      .filter((i) => i >= 0)
      .forEach((i) => closed.push(i));
    return closed;
  }

  // The range may be parenthesised (Пн-Сб) or bare, as OSM writes it (Mo-Fr).
  const range = source.match(
    new RegExp(`\\(?\\s*(${DAY_TOKEN})\\s*[–—-]\\s*(${DAY_TOKEN})\\s*\\)?`, 'i'),
  );
  if (range) {
    const from = weekdayIndex(range[1]);
    const to = weekdayIndex(range[2]);
    if (from >= 0 && to >= 0) {
      for (let day = 0; day < 7; day += 1) {
        const inRange = from <= to ? day >= from && day <= to : day >= from || day <= to;
        if (!inRange) closed.push(day);
      }
    }
  }

  return closed;
}

export function parseOpeningHours(raw: string | undefined): ParsedHours | null {
  if (!raw) return null;

  if (ALWAYS_OPEN.test(raw)) {
    return { alwaysOpen: true, closedDays: [] };
  }

  const match = raw.match(TIME_RANGE);
  if (!match) return null;

  const openMinutes = Number(match[1]) * 60 + Number(match[2]);
  const closeMinutes = Number(match[3]) * 60 + Number(match[4]);

  return {
    alwaysOpen: false,
    openMinutes,
    closeMinutes,
    closedDays: parseDayAnnotation(raw),
  };
}

/**
 * Returns `unknown` when the string cannot be understood, so callers can
 * avoid claiming a venue is closed when the data simply does not say.
 */
export function getOpenState(raw: string | undefined, now: Date = new Date()): OpenState {
  const parsed = parseOpeningHours(raw);
  if (!parsed) return 'unknown';
  if (parsed.alwaysOpen) return 'open';

  const weekday = (now.getDay() + 6) % 7; // JS Sunday=0 → Monday=0
  if (parsed.closedDays.includes(weekday)) return 'closed';

  const minutes = now.getHours() * 60 + now.getMinutes();
  const { openMinutes = 0, closeMinutes = 0 } = parsed;

  // A close time at or past midnight (e.g. 12:00 – 24:00) wraps around.
  if (closeMinutes <= openMinutes) {
    return minutes >= openMinutes || minutes < closeMinutes ? 'open' : 'closed';
  }

  return minutes >= openMinutes && minutes < closeMinutes ? 'open' : 'closed';
}

export function isOpenNow(raw: string | undefined, now?: Date): boolean {
  return getOpenState(raw, now) === 'open';
}

/**
 * Renders a schedule in the reader's language.
 *
 * The stored string is Ukrainian (`Цілодобово 24/7`, `10:00 – 18:00 (Вихідний: Пт)`)
 * because that is what the parser reads. Showing it verbatim on the Russian or
 * Romanian pages would leak the source language, so the understood parts are
 * rebuilt from the parsed values instead.
 */
export function formatOpeningHours(
  raw: string | undefined,
  labels: { alwaysOpen: string; dayOff: string; weekdaysShort: string[] },
): string {
  const parsed = parseOpeningHours(raw);
  if (!parsed) return raw ?? '';
  if (parsed.alwaysOpen) return labels.alwaysOpen;

  const pad = (minutes: number) =>
    `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

  const range = `${pad(parsed.openMinutes ?? 0)} – ${pad(parsed.closeMinutes ?? 0)}`;
  if (parsed.closedDays.length === 0) return range;

  const days = parsed.closedDays.map((day) => labels.weekdaysShort[day]).join(', ');
  return `${range} (${labels.dayOff}: ${days})`;
}

/**
 * Closing time for a place that is open right now, e.g. `22:00`.
 * Returns null when it is closed, always open, or the schedule is unknown —
 * the caller then says so rather than inventing a time.
 */
export function getOpenUntil(raw: string | undefined, now: Date = new Date()): string | null {
  const parsed = parseOpeningHours(raw);
  if (!parsed || parsed.alwaysOpen) return null;
  if (getOpenState(raw, now) !== 'open') return null;

  const close = parsed.closeMinutes ?? 0;
  const hours = Math.floor(close / 60) % 24;
  return `${String(hours).padStart(2, '0')}:${String(close % 60).padStart(2, '0')}`;
}
