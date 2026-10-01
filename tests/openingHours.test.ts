import { getOpenState } from '../src/utils/openingHours';
const at = (iso: string) => new Date(iso);
const cases: [string, string, string][] = [
  ['08:00 – 22:00', '2026-09-05T09:00:00', 'open'],
  ['08:00 – 22:00', '2026-09-05T23:30:00', 'closed'],
  ['08:00 – 22:00', '2026-09-05T07:59:00', 'closed'],
  ['12:00 – 24:00', '2026-09-05T23:00:00', 'open'],
  ['12:00 – 24:00', '2026-09-05T03:00:00', 'closed'],
  ['Цілодобово 24/7', '2026-09-05T03:00:00', 'open'],
  ['10:00 – 18:00 (Вихідний: Пт)', '2026-09-04T12:00:00', 'closed'], // Friday
  ['10:00 – 18:00 (Вихідний: Пт)', '2026-09-05T12:00:00', 'open'],   // Saturday
  ['09:00 – 19:00 (Пн-Сб)', '2026-09-06T12:00:00', 'closed'],        // Sunday
  ['09:00 – 19:00 (Пн-Сб)', '2026-09-05T12:00:00', 'open'],          // Saturday
  ['', '2026-09-05T12:00:00', 'unknown'],
  // OSM-style strings pasted into the admin panel must keep their day limits.
  ['Mo-Fr 09:00 - 20:00', '2026-09-05T12:00:00', 'closed'],   // Saturday
  ['Mo-Fr 09:00 - 20:00', '2026-09-04T12:00:00', 'open'],     // Friday
  ['Mo-Su 10:00 - 22:00', '2026-09-06T12:00:00', 'open'],     // Sunday
  ['Sa-Su 08:00 - 19:00', '2026-09-07T12:00:00', 'closed'],   // Monday
  ['Sa-Su 08:00 - 19:00', '2026-09-05T12:00:00', 'open'],     // Saturday
  ['09:00 - 20:00 (Пн-Пт)', '2026-09-05T12:00:00', 'closed'], // Saturday
];
let failed = 0;
for (const [hours, when, expected] of cases) {
  const actual = getOpenState(hours, at(when));
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${hours}" @ ${when} → ${actual} (expected ${expected})`);
}
console.log(failed === 0 ? '\nAll opening-hours cases pass.' : `\n${failed} failing case(s).`);
