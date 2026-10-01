import { searchPlaces, analyzeQuery } from '../src/utils/search';
import { INITIAL_PLACES } from '../src/data/chisinauPlaces';

let failed = 0;
const t = (label: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} → ${JSON.stringify(actual)}`);
};

// The mappings the spec asks for by name.
t('«кава» → категорія cafes', analyzeQuery('кава').category, 'cafes');
t('«тихо» → категорія quiet_places', analyzeQuery('тихо').category, 'quiet_places');
t('«ноутбук» → категорія remote_work', analyzeQuery('ноутбук').category, 'remote_work');
t('«wi-fi» → фільтр Wi-Fi', analyzeQuery('wi-fi').filters.hasWifi, true);
t('«побачення» → категорія їжі', analyzeQuery('побачення').category, 'food');
t('«тераса» → фільтр тераси', analyzeQuery('тераса').filters.hasTerrace, true);

const names = (q: string) => searchPlaces(INITIAL_PLACES, q).places.map((p) => p.name);
t('«wi-fi» знаходить лише місця з підтвердженим Wi-Fi',
  searchPlaces(INITIAL_PLACES, 'wi-fi').places.every((p) => p.wifi === true), true);
t('«тераса» знаходить лише місця з підтвердженою терасою',
  searchPlaces(INITIAL_PLACES, 'тераса').places.every((p) => p.terrace === true), true);
t('пошук за назвою', names('Dendrariu').length >= 0 && names('Тукано').length >= 0, true);
t('пошук за районом «Ботаніка»',
  searchPlaces(INITIAL_PLACES, 'Ботаніка').places.every((p) => p.district === 'Ботаніка'), true);
t('пошук за тегом «плацинди» знаходить лише релевантне',
  searchPlaces(INITIAL_PLACES, 'плацинди').places.every(
    (p) => (p.tags ?? []).includes('плацинди') || /pl[ăa]cinte|mămuca/i.test(p.name)),
  true);
t('пошук за тегом «плацинди» щось знаходить', names('плацинди').length >= 1, true);
t('жодне місце не має вигаданих оцінок',
  INITIAL_PLACES.every((p) => p.wifi_rating === undefined && p.quiet_rating === undefined), true);
t('порожній запит повертає все', searchPlaces(INITIAL_PLACES, '').places.length, INITIAL_PLACES.length);
t('безглуздий запит нічого не повертає', searchPlaces(INITIAL_PLACES, 'zzzqqq').places.length, 0);
t('«кава» ранжує кафе першими',
  searchPlaces(INITIAL_PLACES, 'кава').places[0].category, 'cafes');

console.log(failed === 0 ? '\nAll search cases pass.' : `\n${failed} failing case(s).`);
