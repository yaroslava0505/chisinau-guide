import { INITIAL_PLACES, INITIAL_EVENTS } from '../src/data/chisinauPlaces';
import { localizePlace, localizeEvent } from '../src/utils/localize';
import { uk } from '../src/i18n/dictionaries/uk';
import { ru } from '../src/i18n/dictionaries/ru';
import { ro } from '../src/i18n/dictionaries/ro';
import { parsePath, buildPath, swapLocale, withLocale, localeFromPath } from '../src/router';
import { analyzeQuery } from '../src/utils/search';

let failed = 0;
const t = (label: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} → ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`);
};

// --- dictionary completeness: every uk key must exist in ru and ro ---
const keysOf = (obj: any, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? keysOf(v, `${prefix}${k}.`)
      : [`${prefix}${k}`]);

const ukKeys = keysOf(uk).sort();
t('ru має всі ключі uk', keysOf(ru).sort().length === ukKeys.length && keysOf(ru).sort().every((k, i) => k === ukKeys[i]), true);
t('ro має всі ключі uk', keysOf(ro).sort().length === ukKeys.length && keysOf(ro).sort().every((k, i) => k === ukKeys[i]), true);

const emptyIn = (d: any) => keysOf(d).filter((path) => {
  const value = path.split('.').reduce((o: any, k) => o?.[k], d);
  return typeof value === 'string' && value.trim() === '';
});
t('ru не має порожніх рядків', emptyIn(ru), []);
t('ro не має порожніх рядків', emptyIn(ro), []);

// --- every place and event is translated into both languages ---
const untranslatedPlaces = INITIAL_PLACES.filter(
  (p) => !p.i18n?.ru?.description || !p.i18n?.ro?.description,
).map((p) => p.id);
t('усі місця перекладені', untranslatedPlaces, []);

const untranslatedEvents = INITIAL_EVENTS.filter(
  (e) => !e.i18n?.ru?.description || !e.i18n?.ro?.description,
).map((e) => e.id);
t('усі події перекладені', untranslatedEvents, []);

// --- localize picks the right language and falls back safely ---
const dendrariu = INITIAL_PLACES.find((p) => p.name.includes('Dendrariu'))!;
t('localizePlace ro', localizePlace(dendrariu, 'ro').name, 'Parcul Dendrariu');
t('localizePlace ru', localizePlace(dendrariu, 'ru').name, 'Парк Дендрарий (Parcul Dendrariu)');
t('localizePlace uk не змінює', localizePlace(dendrariu, 'uk') === dendrariu, true);
t('фолбек на uk без перекладу',
  localizePlace({ ...dendrariu, i18n: undefined }, 'ro').name, dendrariu.name);
t('теги української зберігаються поряд з перекладеними',
  localizePlace(dendrariu, 'ro').tags?.includes('парк'), true);
// Real data has translations for every event already (checked above), so the
// fallback/localization behaviour itself is still exercised against a fixture.
const sampleEvent = {
  id: 'e1', title: 'Ніч музеїв', slug: 'noaptea-muzeelor', date: '', date_iso: '2026-09-26',
  time: '18:00', location_name: '', address: '', category: 'Культура',
  event_type: 'exhibition' as const, price: '', description: 'Опис', image: '', tags: [],
  is_demo: false,
  i18n: { ro: { title: 'Noaptea Muzeelor', description: 'Descriere' } },
};
t('localizeEvent ro', localizeEvent(sampleEvent, 'ro').title, 'Noaptea Muzeelor');
t('localizeEvent фолбек на uk', localizeEvent({ ...sampleEvent, i18n: undefined }, 'ro').title, 'Ніч музеїв');
t('каталог не містить вигаданих подій', INITIAL_EVENTS.every((e) => !e.is_demo), true);
t('каталог має реальні події', INITIAL_EVENTS.length > 0, true);

// --- routing with locale prefixes ---
t('parsePath /ru/cafes', parsePath('/ru/cafes'), { view: 'category', category: 'cafes' });
t('parsePath /ro/remote-work/x', parsePath('/ro/remote-work/x'), { view: 'place', category: 'remote_work', slug: 'x' });
t('parsePath /cafes (uk на корені)', parsePath('/cafes'), { view: 'category', category: 'cafes' });
t('parsePath /uk/cafes — псевдонім кореня', parsePath('/uk/cafes'), { view: 'category', category: 'cafes' });
t('localeFromPath /ru/map', localeFromPath('/ru/map'), 'ru');
t('localeFromPath /map', localeFromPath('/map'), 'uk');
t('buildPath ro', buildPath({ view: 'map' }, 'ro'), '/ro/map');
t('buildPath uk без префікса', buildPath({ view: 'map' }, 'uk'), '/map');
t('withLocale кореня', withLocale('/', 'ru'), '/ru');
t('swapLocale зберігає сторінку', swapLocale('/ru/cafes/molka', 'ro'), '/ro/cafes/molka');
t('swapLocale назад на uk', swapLocale('/ro/events', 'uk'), '/events');
t('невідомий шлях', parsePath('/ru/nope/nope/nope').view, 'notfound');

// --- multilingual search intents ---
t('«cafea» → cafes', analyzeQuery('cafea').category, 'cafes');
t('«кофе» → cafes', analyzeQuery('кофе').category, 'cafes');
t('«laptop» → remote_work', analyzeQuery('laptop').category, 'remote_work');
t('«ноутбук» → remote_work', analyzeQuery('ноутбук').category, 'remote_work');
t('«liniște» → quiet_places', analyzeQuery('liniște').category, 'quiet_places');
t('«тихо» → quiet_places', analyzeQuery('тихо').category, 'quiet_places');
t('«terasa» → фільтр тераси', analyzeQuery('terasa').filters.hasTerrace, true);
t('«gratuit» → безкоштовні', analyzeQuery('gratuit').filters.freeOnly, true);
t('«свидание» → категорія їжі', analyzeQuery('свидание').category, 'food');
t('«întâlnire» → категорія їжі', analyzeQuery('întâlnire').category, 'food');
t('«internet» → Wi-Fi', analyzeQuery('internet').filters.hasWifi, true);

console.log(failed === 0 ? '\nAll i18n cases pass.' : `\n${failed} failing case(s).`);
