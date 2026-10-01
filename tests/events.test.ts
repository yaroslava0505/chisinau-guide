import { matchesWhen, nextOccurrence, weekendRange, occurrenceLabel } from '../src/utils/events';
import { uk } from '../src/i18n/dictionaries/uk';
import type { CityEvent } from '../src/types';

const base = { id:'e', title:'t', slug:'s', time:'', location_name:'', address:'', category:'', event_type:'concert', price:'', description:'', image:'', tags:[], is_demo:true } as unknown as CityEvent;
const ev = (patch: Partial<CityEvent>): CityEvent => ({ ...base, ...patch } as CityEvent);

// Wednesday 2026-09-09 as "now"
const now = new Date(2026, 8, 9, 12, 0);
const cases: [string, boolean, boolean][] = [];
const check = (label: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} → ${JSON.stringify(actual)} (expected ${JSON.stringify(expected)})`);
  return ok;
};

let failed = 0;
const t = (l: string, a: unknown, e: unknown) => { if (!check(l, a, e)) failed++; };

t('today matches same-day event', matchesWhen(ev({date_iso:'2026-09-09'}), 'today', now), true);
t('today rejects tomorrow event', matchesWhen(ev({date_iso:'2026-09-10'}), 'today', now), false);
t('tomorrow matches next-day event', matchesWhen(ev({date_iso:'2026-09-10'}), 'tomorrow', now), true);
t('multi-day event covers today', matchesWhen(ev({date_iso:'2026-09-07', end_date_iso:'2026-09-11'}), 'today', now), true);
t('weekend matches Saturday event', matchesWhen(ev({date_iso:'2026-09-12'}), 'weekend', now), true);
t('weekend rejects next-week event', matchesWhen(ev({date_iso:'2026-09-16'}), 'weekend', now), false);
t('week matches event in 5 days', matchesWhen(ev({date_iso:'2026-09-14'}), 'week', now), true);
t('week rejects event in 10 days', matchesWhen(ev({date_iso:'2026-09-19'}), 'week', now), false);
t('past one-off is not today', matchesWhen(ev({date_iso:'2026-08-01'}), 'today', now), false);
t('weekly event rolls forward to next Saturday', nextOccurrence(ev({date_iso:'2026-09-05', recurring_weekly:true}), now)?.toDateString(), new Date(2026,8,12).toDateString());
t('weekly event matches weekend', matchesWhen(ev({date_iso:'2026-09-05', recurring_weekly:true}), 'weekend', now), true);
t('weekend range is Sat–Sun', [weekendRange(now).start.getDate(), weekendRange(now).end.getDate()], [12, 13]);
t('label for today', occurrenceLabel(ev({date_iso:'2026-09-09'}), uk, now), 'Сьогодні');
t('label for tomorrow', occurrenceLabel(ev({date_iso:'2026-09-10'}), uk, now), 'Завтра');
t('label for later date', occurrenceLabel(ev({date_iso:'2026-09-26'}), uk, now), '26 вересня');
t('label for weekly', occurrenceLabel(ev({date_iso:'2026-09-05', recurring_weekly:true}), uk, now), 'Щосуботи · найближче 12 вересня');

console.log(failed === 0 ? '\nAll event-date cases pass.' : `\n${failed} failing case(s).`);
