import { formatOpeningHours } from '../src/utils/openingHours';
import { uk } from '../src/i18n/dictionaries/uk';
import { ru } from '../src/i18n/dictionaries/ru';
import { ro } from '../src/i18n/dictionaries/ro';

let failed = 0;
const t = (label: string, actual: unknown, expected: unknown) => {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} → ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`);
};

t('24/7 uk', formatOpeningHours('Цілодобово 24/7', uk.common), 'Цілодобово 24/7');
t('24/7 ru', formatOpeningHours('Цілодобово 24/7', ru.common), 'Круглосуточно 24/7');
t('24/7 ro', formatOpeningHours('Цілодобово 24/7', ro.common), 'Non-stop 24/7');
t('простий діапазон', formatOpeningHours('08:00 – 22:00', ru.common), '08:00 – 22:00');
t('вихідний ru', formatOpeningHours('10:00 – 18:00 (Вихідний: Пт)', ru.common), '10:00 – 18:00 (Выходной: Пт)');
t('вихідний ro', formatOpeningHours('10:00 – 18:00 (Вихідний: Пт)', ro.common), '10:00 – 18:00 (Închis: Vi)');
t('лише будні ro', formatOpeningHours('09:00 – 20:00 (Пн-Пт)', ro.common), '09:00 – 20:00 (Închis: Sâ, Du)');
t('лише будні ru', formatOpeningHours('07:30 – 19:30 (Пн-Пт)', ru.common), '07:30 – 19:30 (Выходной: Сб, Вс)');
t('через північ', formatOpeningHours('12:00 – 24:00', ro.common), '12:00 – 00:00');
t('порожній рядок', formatOpeningHours('', ro.common), '');
t('нерозпізнане лишається як є', formatOpeningHours('за домовленістю', ru.common), 'за домовленістю');

console.log(failed === 0 ? '\nAll schedule-format cases pass.' : `\n${failed} failing case(s).`);
